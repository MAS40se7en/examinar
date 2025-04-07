<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;
use App\Models\UserGroup;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $userGroups = UserGroup::all();

        if($userGroups->isEmpty()) {
            $userGroups = UserGroup::factory()->count(5)->create();
        }

        Project::factory()->count(50)->make()->each(function($project) use ($users, $userGroups) {
            // Assign a random user as 'created_by'
            $project->created_by = $users->random()->id;

            if($userGroups->count() > 0) {
                $project->group_id = $userGroups->random()->id;
            }
            
            // Save the project
            $project->save();
        });
        
    }
}
