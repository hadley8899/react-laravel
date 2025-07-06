<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactCustomVariableValue extends Model
{
    use HasFactory;

    protected $table = 'contact_custom_variable_values';

    protected $fillable = [
        'customer_id',
        'custom_variable_id',
        'value',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    /* ----------------------------------------------------- */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function variable(): BelongsTo
    {
        return $this->belongsTo(ContactCustomVariable::class, 'custom_variable_id');
    }
}
