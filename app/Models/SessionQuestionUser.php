<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionQuestionUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_session_id',
        'question_id',
        'user_id',
        'answered_at',
    ];

    public function session() {
        return $this->belongsTo(ProjectSession::class, 'project_session_id');
    }

    public function question() {
        return $this->belongsTo(Question::class, 'question_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
}
