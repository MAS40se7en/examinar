<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
{
    $questionTypes = ['multiple_choice', 'text'];
    $type = fake()->randomElement($questionTypes);

    $possibleAnswers = $type === 'multiple_choice' ?
        ['option 1', 'option 2', 'option3'] : null;

    return [
        'project_id' => Project::factory(),
        'question_body' => fake()->sentence(),
        'question_type' => $type,
        'possible_answers' => $possibleAnswers,
    ];
}
}
