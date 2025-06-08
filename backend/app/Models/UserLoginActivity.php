<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLoginActivity extends Model
{
    protected $table = 'user_login_activity';
    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'login_at',
        'success',
    ];

    protected $casts = [
        'login_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
