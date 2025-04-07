<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\Question;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Log;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Answers>
 */
class AnswersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Step 1: Get a random question
        $question = Question::inRandomOrder()->first();
    
        if (!$question) {
            throw new \Exception('No question found.');
        }
    
        // Step 2: Get the associated project
        $project = $question->project;
    
        if (!$project) {
            throw new \Exception('No project found for the selected question.');
        }
    
        // Step 3: Get the associated user group
        $userGroup = $project->userGroup;
    
        if (!$userGroup) {
            throw new \Exception('No user group found for the selected project.');
        }
    
        // Step 4: Get a random user from the user group
        $users = $userGroup->users;
    
        if (empty($users)) {
            throw new \Exception('No users found in the user group.');
        }
    
        $randomUser = $this->faker->randomElement($users);
    
        // Step 5: Determine the answer based on question type
        $questionType = $question->question_type;
        $possibleAnswers = $question->possible_answers;
    
        // Log values for debugging
        Log::info('Question Type:', ['questionType' => $questionType]);
        Log::info('Possible Answers:', ['possibleAnswers' => $possibleAnswers]);
    
        // Check if possible_answers is an array and not empty
        if ($questionType === 'multiple_choice' && is_array($possibleAnswers) && !empty($possibleAnswers)) {
            // Select a random answer from possible_answers
            $answer = $this->faker->randomElement($possibleAnswers);
        } else {
            // Generate a default answer if not multiple_choice or if possible_answers is empty
            $answer = $this->faker->sentence();
        }
    
        // Log the selected answer
        Log::info('Selected Answer:', ['answer' => $answer]);
    
        return [
            'question_id' => $question->id,
            'user_id' => $randomUser,
            'answer_body' => $answer,
            'submitted_at' => now(), // Use current timestamp
        ];
    }
    


}
