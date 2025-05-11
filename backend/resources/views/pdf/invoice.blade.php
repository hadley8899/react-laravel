<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            color: #333;
        }

        .invoice-header {
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
        }

        .company-details, .customer-details {
            margin-bottom: 20px;
        }

        .invoice-info {
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f8f8f8;
        }

        .text-right {
            text-align: right;
        }

        .totals {
            float: right;
            width: 300px;
        }

        .status {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 10px;
        }

        .status-paid {
            background-color: #d4edda;
            color: #155724;
        }

        .status-pending {
            background-color: #fff3cd;
            color: #856404;
        }

        .status-overdue {
            background-color: #f8d7da;
            color: #721c24;
        }

        .status-draft {
            background-color: #e2e3e5;
            color: #383d41;
        }

        .status-cancelled {
            background-color: #d6d8d9;
            color: #1b1e21;
        }
    </style>
</head>
<body>
<div class="invoice-header">
    <h1>INVOICE</h1>
    <div class="status status-{{ $invoice->status }}">
        {{ ucfirst($invoice->status) }}
    </div>
</div>

<div class="company-details">
    <h3>{{ $invoice->company->name }}</h3>
    <p>{{ $invoice->company->address }}</p>
    <p>{{ $invoice->company->city }}, {{ $invoice->company->state }} {{ $invoice->company->zip }}</p>
    <p>{{ $invoice->company->phone }}</p>
    <p>{{ $invoice->company->email }}</p>
</div>

<div class="customer-details">
    <h3>Bill To:</h3>
    <p>{{ $invoice->customer->first_name }} {{ $invoice->customer->last_name }}</p>
    <p>{{ $invoice->customer->email }}</p>
    <p>{{ $invoice->customer->phone }}</p>
</div>

<div class="invoice-info">
    <table>
        <tr>
            <th>Invoice Number</th>
            <th>Issue Date</th>
            <th>Due Date</th>
        </tr>
        <tr>
            <td>{{ $invoice->invoice_number }}</td>
            <td>{{ date('M d, Y', strtotime($invoice->issue_date)) }}</td>
            <td>{{ date('M d, Y', strtotime($invoice->due_date)) }}</td>
        </tr>
    </table>
</div>

<table>
    <thead>
    <tr>
        <th>Description</th>
        <th>Quantity</th>
        <th>Unit</th>
        <th>Unit Price</th>
        <th>Amount</th>
    </tr>
    </thead>
    <tbody>
    @foreach($invoice->items as $item)
        <tr>
            <td>{{ $item->description }}</td>
            <td>{{ $item->quantity }}</td>
            <td>{{ $item->unit }}</td>
            <td>${{ number_format($item->unit_price, 2) }}</td>
            <td>${{ number_format($item->amount, 2) }}</td>
        </tr>
    @endforeach
    </tbody>
</table>

<div class="totals">
    <table>
        <tr>
            <td>Subtotal</td>
            <td class="text-right">${{ number_format($invoice->subtotal, 2) }}</td>
        </tr>
        <tr>
            <td>Tax ({{ $invoice->tax_rate }}%)</td>
            <td class="text-right">${{ number_format($invoice->tax_amount, 2) }}</td>
        </tr>
        <tr>
            <th>Total</th>
            <th class="text-right">${{ number_format($invoice->total, 2) }}</th>
        </tr>
    </table>
</div>

@if($invoice->notes)
    <div style="clear: both; margin-top: 40px;">
        <h3>Notes</h3>
        <p>{{ $invoice->notes }}</p>
    </div>
@endif

@if($invoice->company->invoice_footer_notes)
    <div style="clear: both; margin-top: 40px;">
        <h3>Footer Notes</h3>
        <p>{{ $invoice->company->invoice_footer_notes }}</p>
    </div>
@else
    <div style="clear: both; margin-top: 40px;">
        <h3>Thank You!</h3>
        <p>We appreciate your business.</p>
    </div>
@endif
</body>
</html>
