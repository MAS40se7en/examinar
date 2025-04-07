<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'question_body',
        'question_type',
        'possible_answers',
    ];

    protected $casts = [
        'possible_answers' => 'array',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function answers()
    {
        return $this->hasMany(Answers::class, 'question_id');
    }

    public function sessionQuestionUsers()
{
    return $this->hasMany(SessionQuestionUser::class, 'question_id');
}

// A question can belong to many sessions
public function projectSessions()
{
    return $this->belongsToMany(ProjectSession::class, 'session_question_users', 'question_id', 'project_session_id');
}

// A question can be assigned to many users
public function assignedUsers()
{
    return $this->belongsToMany(User::class, 'session_question_users', 'question_id', 'user_id')
        ->withPivot('answered_at');
}

}
