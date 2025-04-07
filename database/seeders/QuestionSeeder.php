<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Question;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = Project::all();

        foreach ($projects as $project) {
            Question::factory()->count(15)->create([
                'project_id' => $project->id,
            ]);
        }
    }
}
