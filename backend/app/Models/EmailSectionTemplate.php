<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailSectionTemplate extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = ['type', 'title', 'default_content'];

    protected $casts  = ['default_content' => 'array'];
}
