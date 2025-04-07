<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'group_id',
        'start_date',
        'deadline',
        'created_by',
        'project_admin',
        'allow_edit',
        'completed',
    ];

    protected $casts = [
        'project_admin' => 'array',
        'allow_edit' => 'boolean',
        'completed' => 'boolean'
    ];
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
    //
    public function getProjectAdminsAttribute()
    {
        return User::whereIn('id', $this->project_admin)->get();
    }

    public function sessions() {
        return $this->hasMany(ProjectSession::class, 'project_id');
    }

    public function userGroup()
    {
        return $this->belongsTo(UserGroup::class, 'group_id');
    }
    public function getUserGroupUsersAttribute()
    {
        $userGroup = $this->userGroup;
        return $userGroup ? User::whereIn('id', $userGroup->users)->get() : [];
    }
}
