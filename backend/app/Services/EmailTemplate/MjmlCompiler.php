<?php

namespace App\Services\EmailTemplate;

use RuntimeException;
use Symfony\Component\Process\Process;

class MjmlCompiler
{
    public function compile(string $mjml): array
    {
        $process = new Process(['npx', 'mjml', '-s', '-i']); // -s STDIN->STDOUT, -i quiet
        $process->setInput($mjml);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new RuntimeException('MJML compile failed: ' . $process->getErrorOutput());
        }

        $html = $process->getOutput();
        $text = strip_tags($html);            // quick plaintext; refine later
        return compact('html', 'text');
    }
}
