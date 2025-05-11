@php use Illuminate\Support\Carbon; @endphp
@component('mail::message')
# Invoice #{{ $invoice->invoice_number }}

Hi {{ $invoice->customer?->first_name ?? '' }},

Please find your invoice attached as a PDF.

@component('mail::table')
| Item | Qty | Unit Price | Amount |
|------|----:|-----------:|-------:|
@foreach ($invoice->items as $i)
| {{ $i->description }} | {{ $i->quantity }} | £{{ number_format($i->unit_price,2) }} | £{{ number_format($i->amount,2) }} |
@endforeach
@endcomponent

**Total due:** £{{ number_format($invoice->total,2) }}
**Due date:** {{ Carbon::parse($invoice->due_date)->toFormattedDateString() }}

Thanks,
{{ config('app.name') }}
@endcomponent
