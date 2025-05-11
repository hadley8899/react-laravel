<?php

namespace App\Mail;

use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(private Invoice $invoice) {}

    public function build(): self
    {
        $pdf = Pdf::loadView('pdf.invoice', ['invoice' => $this->invoice])
            ->output();

        return $this->subject("Your invoice #{$this->invoice->invoice_number}")
            ->markdown('emails.invoice', ['invoice' => $this->invoice])
            ->attachData($pdf, "invoice-{$this->invoice->invoice_number}.pdf", [
                'mime' => 'application/pdf',
            ]);
    }
}
