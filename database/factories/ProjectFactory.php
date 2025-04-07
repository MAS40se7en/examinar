<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserGroup;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
{
    $groupIds = UserGroup::pluck('id')->toArray();

    $projectAdminIds = User::inRandomOrder()->limit(rand(1, 5))->pluck('id')->toArray();

    if (empty($projectAdminIds)) {
        throw new \Exception('No user available for seeding');
    }

    $adminIds = User::where('role', 'admin')->pluck('id')->toArray();

    if (empty($adminIds)) {
        throw new \Exception('No Admin user available for seeding');
    }

    return [
        'name' => fake()->sentence(),
        'description' => fake()->paragraph(),
        'group_id' => fake()->randomElement($groupIds),
        'start_date' => fake()->dateTimeBetween('today', '+1 year')->format('Y-m-d'),
        'deadline' => fake()->dateTimeBetween('+1 year', '+2 years')->format('Y-m-d'),
        'created_by' => fake()->randomElement($adminIds),
        'project_admin' => $projectAdminIds,
    ];
}
}
