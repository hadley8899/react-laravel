<?php

namespace App\Http\Controllers;

use App\Enums\CampaignContactStatus;
use App\Enums\CampaignEventType;
use App\Models\CampaignContact;
use App\Models\CampaignEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        // ─── Verify Mailgun signature (prevents spoofing) ───
        // Docs: https://documentation.mailgun.com/en/latest/user_manual.html#webhooks
        $timestamp = $request->input('signature.timestamp');
        $token = $request->input('signature.token');
        $signature = $request->input('signature.signature');

        $computed = hash_hmac('sha256', $timestamp . $token, config('services.mailgun.secret'));
        if (!hash_equals($computed, $signature)) {
            Log::warning('Mailgun webhook signature mismatch');
            return response()->json(['message' => 'invalid signature'], 400);
        }

        // ─── Parse event ─────────────────────────────────────────
        $event = $request->input('event-data');
        $eventType = $event['event']; // opened, clicked, bounced, complained, failed…
        $messageId = $event['message']['headers']['message-id'] ?? null;

        if (!$messageId) {
            return response()->json(['message' => 'missing message-id'], 422);
        }

        /** @var CampaignContact|null $contact */
        $contact = CampaignContact::query()
            ->where('provider_message_id', $messageId)
            ->first();

        if (!$contact) {
            Log::warning('Mailgun webhook: message-id not found', ['id' => $messageId]);
            return response()->json(['message' => 'contact not found'], 404);
        }

        // ─── Store event row ────────────────────────────────────
        $eventModel = $contact->events()->create([
            'type' => CampaignEventType::from(Str::slug($eventType)),
            'data' => $event,
            'created_at' => now(),
        ]);

        // ─── Update aggregate fields for quick reporting ────────
        match ($eventModel->type) {
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
