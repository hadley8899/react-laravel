<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Company;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $issueDate = Carbon::now()->subDays(fake()->numberBetween(1, 60));
        $dueDate = (clone $issueDate)->addDays(fake()->numberBetween(7, 30));
        $subtotal = fake()->randomFloat(2, 50, 500);
        $taxRate = fake()->randomFloat(2, 5, 10);
        $taxAmount = $subtotal * ($taxRate / 100);
        $total = $subtotal + $taxAmount;

        // Get a customer (or create one if none exists)
        $customer = Customer::exists()
            ? Customer::inRandomOrder()->first()
            : Customer::factory()->create();

        return [
            'uuid' => Str::uuid(),
            'invoice_number' => 'INV-' . date('Y') . '-' . str_pad(fake()->unique()->numberBetween(1001, 9999), 4, '0', STR_PAD_LEFT),
            'customer_id' => $customer->id,
            'company_id' => $customer->company_id, // Add company_id from the customer
            'issue_date' => $issueDate,
            'due_date' => $dueDate,
            'subtotal' => $subtotal,
            'tax_rate' => $taxRate,
            'tax_amount' => $taxAmount,
            'total' => $total,
            'status' => fake()->randomElement(['draft', 'pending', 'paid', 'overdue', 'cancelled']),
            'notes' => fake()->optional(0.7)->sentence(),
        ];
    }
}
