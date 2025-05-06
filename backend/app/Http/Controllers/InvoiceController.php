<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the invoices.
     */
    public function index(): AnonymousResourceCollection
    {
        $search = request()->input('search');

        $invoices = Invoice::with(['customer', 'items'])
            ->orderBy('created_at', 'desc');

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

        $results = $invoices->paginate(15);

        return InvoiceResource::collection($results);
    }

    /**
     * Store a newly created invoice in storage.
     */
    public function store(StoreInvoiceRequest $request): JsonResponse
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            // Create the invoice
            $invoice = Invoice::create([
                'invoice_number' => $validated['invoice_number'],
                'customer_id' => $validated['customer_id'],
                'issue_date' => $validated['issue_date'],
                'due_date' => $validated['due_date'],
                'subtotal' => $validated['subtotal'],
                'tax_rate' => $validated['tax_rate'],
                'tax_amount' => $validated['tax_amount'],
                'total' => $validated['total'],
                'status' => $validated['status'] ?? 'draft',
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create invoice items
            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $item) {
                    $invoice->items()->create([
                        'description' => $item['description'],
                        'quantity' => $item['quantity'],
                        'unit' => $item['unit'] ?? null,
                        'unit_price' => $item['unit_price'],
                        'amount' => $item['amount'],
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Invoice created successfully',
                'invoice' => new InvoiceResource($invoice->load(['customer', 'items'])),
            ], 201);

        } catch (\Exception $e) {
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
    public function show(string $uuid): JsonResponse
    {
        $invoice = Invoice::with(['customer', 'items'])
            ->where('uuid', $uuid)
            ->firstOrFail();

        return response()->json([
            'invoice' => new InvoiceResource($invoice),
        ]);
    }

    /**
     * Update the specified invoice in storage.
     */
    public function update(UpdateInvoiceRequest $request, string $uuid): JsonResponse
    {
        $validated = $request->validated();
        $invoice = Invoice::where('uuid', $uuid)->firstOrFail();

        try {
            DB::beginTransaction();

            // Update invoice
            $invoice->update($validated);

            // Handle invoice items if provided
            if (isset($validated['items'])) {
                // Get existing item UUIDs
                $existingItemUuids = $invoice->items->pluck('uuid')->toArray();
                $updatedItemUuids = [];

                // Update or create items
                foreach ($validated['items'] as $itemData) {
                    if (isset($itemData['uuid'])) {
                        // Update existing item
                        $item = InvoiceItem::where('uuid', $itemData['uuid'])
                            ->where('invoice_id', $invoice->id)
                            ->first();

                        if ($item) {
                            $item->update([
                                'description' => $itemData['description'],
                                'quantity' => $itemData['quantity'],
                                'unit' => $itemData['unit'] ?? null,
                                'unit_price' => $itemData['unit_price'],
                                'amount' => $itemData['amount'],
                            ]);

                            $updatedItemUuids[] = $itemData['uuid'];
                        }
                    } else {
                        // Create new item
                        $item = $invoice->items()->create([
                            'description' => $itemData['description'],
                            'quantity' => $itemData['quantity'],
                            'unit' => $itemData['unit'] ?? null,
                            'unit_price' => $itemData['unit_price'],
                            'amount' => $itemData['amount'],
                        ]);

                        $updatedItemUuids[] = $item->uuid;
                    }
                }

                // Delete items not included in the update
                $itemsToDelete = array_diff($existingItemUuids, $updatedItemUuids);
                if (!empty($itemsToDelete)) {
                    InvoiceItem::whereIn('uuid', $itemsToDelete)
                        ->where('invoice_id', $invoice->id)
                        ->delete();
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Invoice updated successfully',
                'invoice' => new InvoiceResource($invoice->fresh(['customer', 'items'])),
            ]);

        } catch (\Exception $e) {
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
        $invoice = Invoice::query()->where('uuid', $uuid)->firstOrFail();

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

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error deleting invoice',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
