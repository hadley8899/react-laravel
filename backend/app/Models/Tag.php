<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Concerns\HasTimestamps;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasUuid, HasFactory, HasTimestamps;

    protected $fillable = ['company_id', 'name', 'color'];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function customers(): BelongsToMany
    {
        return $this->belongsToMany(Customer::class)->using(CustomerTag::class);
    }
}
