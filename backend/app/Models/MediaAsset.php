<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class MediaAsset extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'media_assets';

    protected $fillable = [
        'uuid',
        'company_id',
        'directory_id',
        'uploaded_by',
        'filename',
        'original_name',
        'mime_type',
        'size',
        'width',
        'height',
        'alt',
    ];

    protected $casts = [
        'company_id' => 'integer',
        'directory_id' => 'integer',
        'uploaded_by' => 'integer',
        'size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function directory(): BelongsTo
    {
        return $this->belongsTo(MediaDirectory::class, 'directory_id');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function getUrlAttribute(): string
    {
        return Storage::url($this->filename);
    }
}
