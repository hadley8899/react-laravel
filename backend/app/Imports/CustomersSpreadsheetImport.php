<?php

namespace App\Imports;

use App\Models\Customer;
use App\Models\CustomerImport;
use App\Models\CustomerImportFailure;
use App\Models\Tag;
use App\Services\Customer\CustomerService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Row;

class CustomersSpreadsheetImport implements OnEachRow, WithHeadingRow, WithChunkReading
{
    public function __construct(private readonly CustomerImport $import)
    {
        $meta = $import->meta ?? [];
        $this->mapping = $meta['mapping'] ?? [];
        $this->bulkTagIds = $meta['bulk_tag_ids'] ?? [];
        $this->readTagsCol = $meta['read_tags_column'] ?? false;
        $this->companyId = $import->company_id;
    }

    /* -------- Row by row -------- */
    public function onRow(Row $row): void
    {
        $rowIdx = $row->getIndex();
        $data = $row->toArray();

        try {
            DB::transaction(function () use ($data) {
                $payload = ['company_id' => $this->companyId];
                $customKv = [];
                $rowTags = [];

                foreach ($this->mapping as $sheetCol => $mappedTo) {
                    if (!array_key_exists($sheetCol, $data)) continue;
                    $value = $data[$sheetCol];

                    if (str_starts_with($mappedTo, 'custom:')) {
                        $customKv[Str::after($mappedTo, 'custom:')] = $value;
                    } elseif ($mappedTo === 'tags') {
                        $rowTags = array_filter(array_map('trim', explode(',', $value)));
                    } elseif ($mappedTo !== 'IGNORE') {
                        $payload[$mappedTo] = $value;
                    }
                }

                /* Upsert customer (email as natural key) */
                $customer = null;
                if (!empty($payload['email'])) {
                    $customer = Customer::where('company_id', $this->companyId)
                        ->where('email', $payload['email'])
                        ->first();
                }
                $customer = $customer
                    ? tap($customer)->update($payload)
                    : Customer::create($payload);

                /* Custom fields */
                CustomerService::syncCustomVariables($customer, $customKv);

                /* Tags */
                $allTags = array_unique(array_merge($rowTags, $this->bulkTagIds));
                if ($allTags) {
                    $tagIds = collect($allTags)->map(function ($idOrName) {
                        if (is_numeric($idOrName)) return $idOrName;

                        return Tag::firstOrCreate(
                            ['company_id' => $this->companyId, 'name' => $idOrName],
                            ['uuid' => (string)Str::uuid()]
                        )->id;
                    })->all();

                    $customer->tags()->syncWithoutDetaching($tagIds);
                }
            });

            $this->import->increment('imported_rows');
        } catch (\Throwable $e) {
            $this->import->increment('failed_rows');

            CustomerImportFailure::create([
                'customer_import_id' => $this->import->id,
                'row_number' => $rowIdx,
                'row_data' => $data,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /* -------- Chunking keeps memory low -------- */
    public function chunkSize(): int
    {
        return 500;
    }
}
