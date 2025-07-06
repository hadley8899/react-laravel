<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerImportFailure extends Model
{
    use HasFactory;

    protected $fillable = ['customer_import_id', 'row_number', 'row_data', 'error'];
    protected $casts = ['row_data' => 'array'];

    public function import(): BelongsTo
    {
        return $this->belongsTo(CustomerImport::class);
    }
}
