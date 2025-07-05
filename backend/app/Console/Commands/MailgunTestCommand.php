<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Mailgun\Mailgun;
use Throwable;

class MailgunTestCommand extends Command
{
    protected $signature = 'mailgun:test
                              {to : E-mail address to send to}
                              {--s|subject=Mailgun Test : Subject line}
                              {--m|message="This is a test message." : Plain-text body}';

    protected $description = 'Quick one-off test email through Mailgun.';

    public function handle(): int
    {
        $domain = config('services.mailgun.domain');
        $secret = config('services.mailgun.secret');
        $endpoint = config('services.mailgun.endpoint', 'api.eu.mailgun.net');

        if (!$domain || !$secret || !$endpoint) {
            $this->error('Mailgun credentials are missing. Check .env.');
            return self::FAILURE;
        }

        $mg = Mailgun::create($secret, $endpoint);

        $params = [
            'from' => config('mail.from.name') . ' <' . config('mail.from.address') . '>',
            'to' => $this->argument('to'),
            'subject' => $this->option('subject'),
            'text' => $this->option('message'),
        ];

        $this->info('Sending…');
        try {
            $response = $mg->messages()->send($domain, $params);

            // The API returns something like <20250704123456.1234567890@mailgun.org>
            $this->info('✔ Sent! Message-ID: ' . $response->getId());

            return self::SUCCESS;
        } catch (Throwable $e) {
            $this->error('✖ Failed: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}
