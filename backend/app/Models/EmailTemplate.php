<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany};

class EmailTemplate extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'company_id',
        'name',
        'subject',
        'preview_text',
        'layout_json',
        'html_cached',
        'text_cached',
        'created_by',
    ];

    protected $casts = [
        'layout_json' => 'array',
    ];

    /* -----------------------------------------------------------------
     | Relationships
     |-----------------------------------------------------------------*/
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(EmailTemplateRevision::class, 'template_id');
    }
}
