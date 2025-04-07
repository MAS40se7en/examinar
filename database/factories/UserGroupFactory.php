<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserGroup>
 */
class UserGroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $adminIds = User::where('role', 'admin')->pluck('id')->toArray();

        if (empty($adminIds)) {
            throw new \Exception('No Admin user available for seeding');
        }

        $userIds = User::where('role', '!=', 'admin')->inRandomOrder()->limit(rand(1, 5))->pluck('id')->toArray();

        return [
            'name' => fake()->name,
            'created_by' => fake()->randomElement($adminIds),
            'users' => $userIds,
        ];
    }
}
