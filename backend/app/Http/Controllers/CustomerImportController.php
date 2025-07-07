<?php

namespace App\Http\Controllers;

use App\Exports\CustomerImportTemplateExport;
use App\Http\Resources\CustomerImportResource;
use App\Jobs\CustomersImportJob;
use App\Models\CustomerImport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\HeadingRowImport;

class CustomerImportController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(CustomerImport::class, 'import');
    }

    public function template()
    {
        return Excel::download(
            new CustomerImportTemplateExport,
            'customers_template.xlsx'
        );
    }

    public function index(Request $request)
    {
        $perPage = (int)$request->get('per_page', 20);

        $imports = CustomerImport::query()->where('company_id', Auth::user()->company->id)
            ->orderByDesc('created_at');

        return CustomerImportResource::collection($imports->paginate($perPage));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv,ods,tsv,xml,html',
        ]);

        $file = $request->file('file');
        $uuid = (string)Str::uuid();
        $stored = $file->storeAs(
            'imports/customers',
            "$uuid." . $file->getClientOriginalExtension()
        );

        $headings = (new HeadingRowImport)
            ->toArray(Storage::path($stored))[0][0] ?? [];
        $rowCount = max(
            0,
            Excel::toCollection(null, Storage::path($stored))[0]->count() - 1
        );

        $import = CustomerImport::query()->create([
            'uuid' => $uuid,
            'company_id' => Auth::user()->company->id,
            'user_id' => Auth::id(),
            'filename' => $file->getClientOriginalName(),
            'disk_path' => $stored,
            'total_rows' => $rowCount,
            'meta' => ['headings' => $headings],
        ]);

        return response()->json(new CustomerImportResource($import), 201);
    }

    public function update(Request $request, CustomerImport $import): JsonResponse
    {
        if ($import->status !== 'draft') {
            return response()->json(['message' => 'Import already started'], 409);
        }

        $data = $request->validate([
            'mapping' => 'required|array',
            'bulk_tag_ids' => 'array',
            'read_tags_column' => 'boolean',
        ]);

        $import->update([
            'meta' => array_merge($import->meta ?? [], $data),
            'status' => 'processing',
            'started_at' => now(),
        ]);

        CustomersImportJob::dispatch($import);

        return response()->json(['queued' => true]);
    }

    public function show(CustomerImport $import): JsonResponse
    {
        return response()->json(
            new CustomerImportResource($import->loadCount('failures'))
        );
    }

    public function downloadFailures(CustomerImport $import)
    {
        $csv = implode(',', ['row_number', 'error']) . "\n";
        foreach ($import->failures as $f) {
            $csv .= $f->row_number . ',"' . addslashes($f->error) . "\"\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=import_failures_$import->uuid.csv",
        ]);
    }
}
