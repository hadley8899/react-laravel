<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Random\RandomException;

class InvoiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * @throws RandomException
     */
    public function run(): void
    {
        // Get all customers to assign invoices to
        $customers = Customer::all();

        if ($customers->isEmpty()) {
            $this->command->info('No customers found. Please run CustomerSeeder first.');
            return;
        }

        // Service items catalog for invoice items
        $serviceItems = [
            ['description' => 'Oil Change', 'unit_price' => 49.99, 'unit' => 'service'],
            ['description' => 'Tire Rotation', 'unit_price' => 25.00, 'unit' => 'service'],
            ['description' => 'Brake Inspection', 'unit_price' => 35.50, 'unit' => 'service'],
            ['description' => 'Air Filter Replacement', 'unit_price' => 19.99, 'unit' => 'part'],
            ['description' => 'Wiper Blade Replacement', 'unit_price' => 24.99, 'unit' => 'part'],
            ['description' => 'Coolant Flush', 'unit_price' => 89.99, 'unit' => 'service'],
            ['description' => 'Battery Replacement', 'unit_price' => 129.99, 'unit' => 'part'],
            ['description' => 'Full Vehicle Inspection', 'unit_price' => 75.00, 'unit' => 'service'],
            ['description' => 'Headlight Replacement', 'unit_price' => 45.00, 'unit' => 'part'],
            ['description' => 'Labor', 'unit_price' => 85.00, 'unit' => 'hour'],
        ];

        // Create invoices with various statuses
        $statuses = ['draft', 'pending', 'paid', 'overdue', 'cancelled'];

        // Ensure we have some of each status for testing
        foreach ($statuses as $status) {
            $this->createInvoicesWithStatus($status, random_int(1, 25), $customers, $serviceItems);
        }

        // Create additional random invoices
        $this->createInvoicesWithStatus(null, random_int(1, 50), $customers, $serviceItems);

        $this->command->info('Created sample invoices with items.');
    }

    /**
     * Create invoices with a specific status or random if null
     */
    private function createInvoicesWithStatus(?string $status, int $count, $customers, $serviceItems): void
    {
        for ($i = 0; $i < $count; $i++) {
            $customer = $customers->random();

            // Create invoice with factory
            $invoiceFactory = Invoice::factory()->state([
                'customer_id' => $customer->id,
                'company_id' => $customer->company_id, // Add company_id from the customer
            ]);

            if ($status) {
                $invoiceFactory = $invoiceFactory->state(['status' => $status]);
            }

            $invoice = $invoiceFactory->create();

            // Add 1-5 random items to the invoice
            $itemCount = rand(1, 5);
            $subtotal = 0;

            for ($j = 0; $j < $itemCount; $j++) {
                // Get a random service/part
                $item = $serviceItems[array_rand($serviceItems)];

                // Random quantity (usually 1 for services, more for parts)
                $quantity = $item['unit'] === 'service' ? 1 : rand(1, 3);

                // Calculate amount
                $amount = $item['unit_price'] * $quantity;
                $subtotal += $amount;

                // Create the invoice item
                InvoiceItem::query()->create([
                    'invoice_id' => $invoice->id,
                    'description' => $item['description'],
                    'quantity' => $quantity,
                    'unit' => $item['unit'],
                    'unit_price' => $item['unit_price'],
                    'amount' => $amount,
                    'uuid' => Str::uuid(),
                ]);
            }

            // Update the invoice with calculated values
            $taxAmount = $subtotal * ($invoice->tax_rate / 100);
            $total = $subtotal + $taxAmount;

            $invoice->update([
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total' => $total,
            ]);
        }
    }
}
