<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'created_by',
        'users'
    ];
    protected $casts = [
        'users' => 'array',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getUsersAttribute($value)
    {
        return json_decode($value, true);
    }

    public function projects()
{
    return $this->hasMany(Project::class, 'group_id');
}

public function users()
    {
        return $this->belongsToMany(User::class, 'user_group_user', 'user_group_id', 'user_id');
    }


}
