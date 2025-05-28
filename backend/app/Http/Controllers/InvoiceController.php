<?php

namespace App\Http\Controllers;

use App\Http\Requests\Invoice\StoreInvoiceRequest;
use App\Http\Requests\Invoice\UpdateInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Mail\InvoiceMail;
use App\Models\Customer;
use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpFoundation\Response;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the invoices.
     */
    public function index(): AnonymousResourceCollection
    {
        $search = request()->input('search');
        $sortBy = request()->input('sort_by', 'created_at');
        $sortDirection = request()->input('sort_direction', 'desc');
        $perPage = request()->input('per_page', 10);

        // Validate sort field to prevent SQL injection
        $allowedSortFields = [
            'invoice_number', 'issue_date', 'due_date', 'total', 'status', 'created_at',
        ];

        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'created_at';
        }

        $invoices = Invoice::with(['customer', 'items']);

        // Handle special case for customer name sorting
        if ($sortBy === 'customer.name') {
            $invoices->join('customers', 'invoices.customer_id', '=', 'customers.id')
                ->orderBy('customers.first_name', $sortDirection)
                ->orderBy('customers.last_name', $sortDirection)
                ->select('invoices.*');
        } else {
            $invoices->orderBy($sortBy, $sortDirection);
        }

        if ($search) {
            $invoices->where(function ($query) use ($search) {
                $query->where('invoice_number', 'like', "%$search%")
                    ->orWhereHas('customer', function ($q) use ($search) {
                        $q->where('first_name', 'like', "%$search%");
                        $q->orWhere('last_name', 'like', "%$search%");
                        $q->orWhere('email', 'like', "%$search%");
                    });
            });
        }

        $invoices->where('invoices.company_id', Auth::user()->company->id);

        $results = $invoices->paginate($perPage);

        return InvoiceResource::collection($results);
    }

    /**
     * Store a newly created invoice in storage.
     */
    public function store(StoreInvoiceRequest $request): JsonResponse|InvoiceResource
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $customer = Customer::query()->where('company_id', Auth::user()->company->id)
                ->where('uuid', $validated['customer_uuid'])
                ->firstOrFail();

            $subtotal = collect($validated['items'])
                ->sum(fn($i) => $i['quantity'] * $i['unit_price']);

            $taxRate = $validated['tax_rate'] ?? 0;
            $taxAmount = round($subtotal * ($taxRate / 100), 2);
            $total = $subtotal + $taxAmount;

            $invoice = Invoice::query()->create([
                'invoice_number' => $validated['invoice_number'],
                'customer_id' => $customer->id,
                'issue_date' => $validated['issue_date'],
                'due_date' => $validated['due_date'],
                'subtotal' => $subtotal,
                'tax_rate' => $taxRate,
                'tax_amount' => $taxAmount,
                'total' => $total,
                'status' => $validated['status'] ?? 'draft',
                'notes' => $validated['notes'] ?? null,
                'company_id' => Auth::user()->company->id,
            ]);

            foreach ($validated['items'] as $item) {
                $invoice->items()->create([
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit' => $item['unit'] ?? null,
                    'unit_price' => $item['unit_price'],
                    'amount' => $item['quantity'] * $item['unit_price'],
                ]);
            }

            DB::commit();

            return new InvoiceResource($invoice);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error creating invoice',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Display the specified invoice.
     */
    public function show(string $uuid)
    {
        $invoice = Invoice::with(['customer', 'items'])
            ->where('uuid', $uuid)
            ->where('company_id', Auth::user()->company->id)
            ->firstOrFail();

        return new InvoiceResource($invoice);
    }

    /**
     * Update the specified invoice in storage.
     */
    public function update(UpdateInvoiceRequest $request, string $uuid): JsonResponse
    {
        $validated = $request->validated();

        $invoice = Invoice::query()->where('uuid', $uuid)
            ->where('company_id', Auth::user()->company->id)
            ->with('items')
            ->firstOrFail();

        try {
            DB::beginTransaction();

            /* ---- customer (optional) ---- */
            if (isset($validated['customer_uuid'])) {
                $customer = Customer::where('company_id', Auth::user()->company->id)
                    ->where('uuid', $validated['customer_uuid'])
                    ->firstOrFail();
                $invoice->customer_id = $customer->id;
            }

            /* ---- base fields ---- */
            $invoice->fill([
                'invoice_number' => $validated['invoice_number'] ?? $invoice->invoice_number,
                'issue_date' => $validated['issue_date'] ?? $invoice->issue_date,
                'due_date' => $validated['due_date'] ?? $invoice->due_date,
                'tax_rate' => $validated['tax_rate'] ?? $invoice->tax_rate,
                'status' => $validated['status'] ?? $invoice->status,
                'notes' => $validated['notes'] ?? $invoice->notes,
            ]);

            /* ---- items ---- */
            if (isset($validated['items'])) {
                $existing = $invoice->items->keyBy('uuid');

                $newItemUuids = [];
                foreach ($validated['items'] as $data) {
                    if (isset($data['uuid']) && $existing->has($data['uuid'])) {
                        // update existing
                        $item = $existing[$data['uuid']];
                        $item->update([
                            'description' => $data['description'],
                            'quantity' => $data['quantity'],
                            'unit' => $data['unit'] ?? null,
                            'unit_price' => $data['unit_price'],
                            'amount' => $data['quantity'] * $data['unit_price'],
                        ]);
                    } else {
                        // new row
                        $item = $invoice->items()->create([
                            'description' => $data['description'],
                            'quantity' => $data['quantity'],
                            'unit' => $data['unit'] ?? null,
                            'unit_price' => $data['unit_price'],
                            'amount' => $data['quantity'] * $data['unit_price'],
                        ]);
                    }
                    $newItemUuids[] = $item->uuid;
                }

                // delete removed
                $invoice->items()
                    ->whereNotIn('uuid', $newItemUuids)
                    ->delete();
            }

            /* ---- recalc totals ---- */
            $subtotal = $invoice->items()->sum(DB::raw('quantity * unit_price'));
            $taxAmount = round($subtotal * ($invoice->tax_rate / 100), 2);
            $invoice->subtotal = $subtotal;
            $invoice->tax_amount = $taxAmount;
            $invoice->total = $subtotal + $taxAmount;

            $invoice->save();

            DB::commit();

            return response()->json([
                'message' => 'Invoice updated',
                'invoice' => new InvoiceResource($invoice->fresh(['customer', 'items'])),
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error updating invoice',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Remove the specified invoice from storage.
     */
    public function destroy(string $uuid): JsonResponse
    {
        $invoice = Invoice::query()->where('uuid', $uuid)->where('company_id', Auth::user()->company->id)->firstOrFail();

        try {
            DB::beginTransaction();

            // Delete related items first
            $invoice->items()->delete();

            // Delete the invoice
            $invoice->delete();

            DB::commit();

            return response()->json([
                'message' => 'Invoice deleted successfully',
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error deleting invoice',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generate PDF for the invoice
     */
    public function generatePdf(string $uuid): Response
    {
        $invoice = Invoice::with(['customer', 'items', 'company'])
            ->where('uuid', $uuid)
            ->where('company_id', Auth::user()->company->id)
            ->firstOrFail();

        $pdf = PDF::loadView('pdf.invoice', [
            'invoice' => $invoice,
        ]);

        return $pdf->download("invoice-{$invoice->invoice_number}.pdf");
    }

    public function email(string $uuid): JsonResponse
    {
        $invoice = Invoice::with(['customer', 'items', 'company'])
            ->where('uuid', $uuid)
            ->where('company_id', Auth::user()->company->id)
            ->firstOrFail();

        // basic guard
        if (!$invoice->customer?->email) {
            return response()->json(['message' => 'Customer has no email address'], 422);
        }

        Mail::to($invoice->customer->email)
            ->send(new InvoiceMail($invoice));

        return response()->json(['message' => 'Invoice emailed successfully']);
    }

}
