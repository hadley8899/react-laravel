<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmailTemplateRevision extends Model
{
    use HasFactory, HasUuid;

    public $timestamps = false;
    protected $fillable = [
        'template_id',
        'layout_json',
        'html_cached',
        'text_cached',
        'created_by',
        'created_at',
    ];

    protected $casts = [
        'layout_json' => 'array',
        'created_at'  => 'datetime',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(EmailTemplate::class, 'template_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
