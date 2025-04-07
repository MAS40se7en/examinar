<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class ProjectSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'start_date',
        'end_date',
        'number_of_questions',
    ];

    protected $dates = [
        'start_date',
        'end_date',
    ];

    // Relationships
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function questions()
    {
        return $this->belongsToMany(Question::class, 'session_question_users', 'project_session_id', 'question_id');
    }

    public function sessionQuestionUsers()
    {
        return $this->hasMany(SessionQuestionUser::class, 'project_session_id');
    }

    // Accessors
    public function getQuestionsPerUserAttribute()
    {
        return $this->number_of_questions ?? 0;
    }

    // Boot method for handling session deletion
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($session) {
            $session->sessionQuestionUsers()->delete();
        });
    }

    // Check if the session is active
    public function isActive()
    {
        $currentDate = now()->startOfDay();
        return $currentDate->between($this->start_date, $this->end_date);
    }

    // Check if a user has completed their assigned questions
    public function isUserCompleted($userId)
    {
        $totalQuestions = $this->sessionQuestionUsers()
            ->where('user_id', $userId)
            ->count();

        $answeredQuestions = $this->sessionQuestionUsers()
            ->where('user_id', $userId)
            ->whereNotNull('answered_at')
            ->count();

        return $totalQuestions > 0 && $totalQuestions === $answeredQuestions;
    }

    // Get questions assigned to a specific user in this session
    public function questionsForUser($userId)
    {
        return $this->sessionQuestionUsers()
            ->where('user_id', $userId)
            ->with('question')
            ->get()
            ->pluck('question');
    }

    // Method to assign questions to a new user
    public function assignQuestionsToNewUser($userId)
    {
        $alreadyAssignedQuestionIds = $this->sessionQuestionUsers()->pluck('question_id')->toArray();

        $availableQuestions = Question::where('project_id', $this->project_id)
        ->whereNotIn('id', $alreadyAssignedQuestionIds)
        ->get();

        foreach ($availableQuestions as $question) {
            $this->sessionQuestionUsers()->create([
                'user_id' => $userId,
                'question_id' => $question->id,
            ]);

            if ($this->sessionQuestionUsers()->where('user_id', $userId)->count() >= $this->number_of_questions) {
                break;
            }
        }

        // If not enough unique questions, repeat questions from the project
    if ($this->sessionQuestionUsers()->where('user_id', $userId)->count() < $this->number_of_questions) {
        // Get all questions from the project to repeat
        $questionsToRepeat = Question::where('project_id', $this->project_id)->get();
        
        // Shuffle the questions to ensure randomness
        $questionsToRepeat = $questionsToRepeat->shuffle();

        foreach ($questionsToRepeat as $question) {
            // Ensure not to exceed the number of required questions
            if ($this->sessionQuestionUsers()->where('user_id', $userId)->count() >= $this->number_of_questions) {
                break;
            }

            // Assign the question
            $this->sessionQuestionUsers()->create([
                'user_id' => $userId,
                'question_id' => $question->id,
            ]);
        }
    }
    }

    // Method to reassign questions when a user is removed
    public function reassignQuestionsOnUserRemoval($userId)
    {
        $userQuestions = $this->sessionQuestionUsers()
            ->where('user_id', $userId)
            ->get();

        $otherUsers = $this->sessionQuestionUsers()
            ->where('user_id', '!=', $userId)
            ->get()
            ->groupBy('user_id');

        foreach ($userQuestions as $userQuestion) {
            $question = $userQuestion->question;
            $reassigned = false;

            foreach ($otherUsers as $otherUserId => $assignedQuestions) {
                if ($assignedQuestions->count() < $this->number_of_questions && !$assignedQuestions->contains('question_id', $question->id)) {
                    $this->sessionQuestionUsers()->create([
                        'user_id' => $otherUserId,
                        'question_id' => $question->id,
                    ]);
                    $reassigned = true;
                    break;
                }
            }

            if (!$reassigned) {
                $userQuestion->delete();
            }
        }
    }

    // Method to get available questions that haven't been assigned
    public function getAvailableQuestions()
    {
        $assignedQuestionIds = $this->sessionQuestionUsers()->pluck('question_id')->toArray();

        return Question::whereNotIn('id', $assignedQuestionIds)->get();
    }

    /**
     * Replace duplicate questions assigned to a user with new questions.
     */
    public function replaceDuplicateQuestionsForUsers()
    {
        // Get all users in this session
        $users = $this->sessionQuestionUsers->groupBy('user_id');
        $allAssignedQuestions = $this->sessionQuestionUsers->pluck('question_id')->toArray();

        // Get new questions that are not yet assigned
        $newQuestions = $this->project->questions()
            ->whereNotIn('id', $allAssignedQuestions)
            ->get();

        foreach ($users as $userId => $userQuestions) {
            $userQuestions = $userQuestions->pluck('question_id')->toArray();

            foreach ($userQuestions as $questionId) {
                // Check if this question is assigned to more than one user
                $questionAssignedCount = $this->sessionQuestionUsers()
                    ->where('question_id', $questionId)
                    ->count();

                if ($questionAssignedCount > 1) {
                    // If a new question is available, replace the duplicate question
                    if ($newQuestions->isNotEmpty()) {
                        $newQuestion = $newQuestions->shift();

                        $this->sessionQuestionUsers()
                            ->where('user_id', $userId)
                            ->where('question_id', $questionId)
                            ->update(['question_id' => $newQuestion->id]);

                        // Update the list of all assigned questions
                        $allAssignedQuestions[] = $newQuestion->id;
                    }
                }
            }
        }
    }

    /**
     * Handle the addition of new questions to the project
     * and replacement of duplicate questions assigned to users.
     */
    public function handleNewAndDuplicateQuestions()
    {
        $this->replaceDuplicateQuestionsForUsers();
    }
}
