<?php

namespace App\Services\Email;

use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Mailgun\Mailgun;
use Throwable;

class EmailDispatcher
{
    /**
     * @param  array{
     *          from:string,
     *          to:string,
     *          subject:string,
     *          html:string,
     *          text:string,
     *          reply_to:string|null,
     *          meta:array<string,string>
     *        } $payload
     * @return string|null   provider message-id if available
     * @throws Throwable
     */
    public function send(array $payload): ?string
    {
        try {
            $useMailgun = app()->environment(['production', 'staging']) && config('mail.mailer') === 'mailgun';

            if ($useMailgun) {
                $mg = Mailgun::create(
                    config('services.mailgun.secret'),
                    config('services.mailgun.endpoint', 'https://api.eu.mailgun.net')
                );

                $resp = $mg->messages()->send(
                    config('services.mailgun.domain'),
                    [
                        'from'        => $payload['from'],
                        'to'          => $payload['to'],
                        'subject'     => $payload['subject'],
                        'html'        => $payload['html'],
                        'text'        => $payload['text'],
                        'h:Reply-To'  => $payload['reply_to'],
                    ] + $payload['meta']
                );

                return $resp->getId();
            }

            // ---------- Local SMTP (Mailhog etc.) ----------
            Mail::html($payload['html'], function (Message $m) use ($payload) {
                $m->from($payload['from'])
                    ->to($payload['to'])
                    ->subject($payload['subject']);

                if ($payload['reply_to']) {
                    $m->replyTo($payload['reply_to']);
                }
            });

            return null; // SMTP transport doesn't expose message-id
        } catch (Throwable $e) {
            // extra logging here keeps transport noise out of job file
            Log::error('EmailDispatcher failed', ['error' => $e->getMessage()]);
            throw $e;   // let the caller (job) decide retries
        }
    }
}
