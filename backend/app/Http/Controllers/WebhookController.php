<?php

namespace App\Http\Controllers;

use App\Enums\CampaignContactStatus;
use App\Enums\CampaignEventType;
use App\Models\CampaignContact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        $timestamp = $request->input('signature.timestamp');
        $token = $request->input('signature.token');
        $signature = $request->input('signature.signature');

        $signingKey = config('services.mailgun.signing_secret')   // ← NEW
            ?? config('services.mailgun.secret');                 //   (fallback)

        $computed = hash_hmac('sha256', $timestamp . $token, $signingKey);

        if (!hash_equals($computed, $signature)) {
            Log::warning('Mailgun webhook signature mismatch');
            return response()->json(['message' => 'invalid signature'], 400);
        }

        /* ── 2.  Resolve the CampaignContact ────────────────────────────── */
        $event = $request->input('event-data');
        $eventName = Str::of($event['event'])->lower()->singular();      // “opened” → “open”
        $messageId = trim($event['message']['headers']['message-id'] ?? '', '<>');

        if (!$messageId) {
            return response()->json(['message' => 'missing message-id'], 422);
        }

        $contact = CampaignContact::query()
            ->where('provider_message_id', $messageId)
            ->orWhere('provider_message_id', "<$messageId>")            // match either style
            ->first();

        if (!$contact) {
            Log::warning('Mailgun webhook: message-id not found', ['id' => $messageId]);
            return response()->json(['message' => 'contact not found'], 404);
        }

        /* ── 3.  Persist the event & update aggregates ─────────────────── */
        $eventEnum = CampaignEventType::tryFrom($eventName) ?? CampaignEventType::Other;

        $eventModel = $contact->events()->create([
            'type' => $eventEnum,
            'data' => $event,
            'created_at' => now(),
        ]);

        match ($eventEnum) {
            CampaignEventType::Open => $contact->update([
                'status' => CampaignContactStatus::Opened,
                'opened_at' => $eventModel->created_at,
            ]),
            CampaignEventType::Click => $contact->update([
                'status' => CampaignContactStatus::Clicked,
                'clicked_at' => $eventModel->created_at,
            ]),
            CampaignEventType::Bounce,
            CampaignEventType::Complaint => $contact->update([
                'status' => CampaignContactStatus::Bounced,
                'bounced_at' => $eventModel->created_at,
                'error_message' => $event['delivery-status']['description'] ?? null,
            ]),
            default => null,
        };

        return response()->json(['message' => 'ok']);
    }
}
