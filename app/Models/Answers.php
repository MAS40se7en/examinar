<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answers extends Model
{
    use HasFactory;

    protected $fillable = [
        'answer_body',
        'user_id',
        'question_id',
        'submitted_at'
    ];

    protected $casts = [
        'submitted_at' => 'datetime'
    ];


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }

    public function sessionQuestionUser()
    {
        return $this->hasOne(SessionQuestionUser::class, 'question_id', 'question_id')
                    ->where('user_id', $this->user_id);
    }
}