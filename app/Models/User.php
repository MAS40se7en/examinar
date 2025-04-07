<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Notifications\ResetPasswordNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;



class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'role',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * The model's defaule values for attributes.
     * 
     * @var array
     */
    protected $attributes = [
        'role' => "User"
    ];

    /**
     * Get the projects for the user
     */
    public function createdProject() {
        return $this->hasMany(Project::class, 'created_by');
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    public function answers() {
        return $this->hasMany(Answers::class, 'user_id');
    }

    public function sessionQuestionUsers()
    {
        return $this->hasMany(SessionQuestionUser::class);
    }

    // Retrieve the questions assigned to the user
    public function assignedQuestions()
    {
        return $this->belongsToMany(Question::class, 'session_question_users', 'user_id', 'question_id')
            ->withPivot('answered_at');
    }

    public function userGroups()
    {
        return $this->belongsToMany(UserGroup::class, 'user_group_user', 'user_id', 'user_group_id');
    }
}
