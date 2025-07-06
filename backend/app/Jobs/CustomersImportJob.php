<?php

namespace App\Jobs;

use App\Imports\CustomersSpreadsheetImport;
use App\Models\CustomerImport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class CustomersImportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 0;

    public function __construct(private readonly CustomerImport $import)
    {
    }

    public function handle(): void
    {
        try {
            Excel::import(
                new CustomersSpreadsheetImport($this->import),
                Storage::path($this->import->disk_path)
            );

            $this->import->update([
                'status' => 'finished',
                'finished_at' => now(),
            ]);
        } catch (Throwable $e) {
            Log::error('Customer import failed', [
                'import_id' => $this->import->id,
                'msg' => $e->getMessage(),
            ]);

            $this->import->update(['status' => 'failed']);
        }
    }
}
