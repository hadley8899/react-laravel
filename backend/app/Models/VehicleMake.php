<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VehicleMake extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = ['name'];

    /**
     * Get the models for this make.
     */
    public function models(): HasMany
    {
        return $this->hasMany(VehicleModel::class);
    }
}
