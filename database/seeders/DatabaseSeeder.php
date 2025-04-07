<?php

namespace Database\Seeders;

use App\Models\Answers;
use App\Models\Project;
use App\Models\User;
use App\Models\UserGroup;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
        /**
         * Seed the application's database.
         */
        public function run(): void
        {
                // User::factory(10)->create();

                User::factory()->create([
                        'name' => 'Admin',
                        'email' => 'test@example.com',
                        'role' => 'admin',
                        'password' => bcrypt('123.321A'),
                        'email_verified_at' => time(),
                ]);
                User::factory()->create([
                        'name' => 'User',
                        'email' => 'test1@example.com',
                        'role' => 'user',
                        'password' => bcrypt('123.321A'),
                        'email_verified_at' => time(),
                ]);
                User::factory()->create([
                        'name' => 'User 2',
                        'email' => 'test2@example.com',
                        'role' => 'user',
                        'password' => bcrypt('123.321A'),
                        'email_verified_at' => time(),
                ]);
                //
                //User::factory()->create([
                //    'id' => '2',
                //    'name' => 'Test User 1',
                //    'email' => 'test1@example.com',
                //    'role' => 'admin',
                //    'password' => bcrypt('123.321A'),
                //    'email_verified_at' => time(),
                //]);
                //
                User::factory()->create([
                    'name' => 'Test User 2',
                    'email' => 'test4@example.com',
                    'role' => 'user',
                    'password' => bcrypt('123.321A'),
                    'email_verified_at' => time(),
                ]);
                //
                //User::factory()->create([
                //    'id' => '4',
                //    'name' => 'Test User 3',
                //    'email' => 'test3@example.com',
                //    'role' => 'user',
                //    'password' => bcrypt('123.321A'),
                //    'email_verified_at' => time(),
                //]);
                //
                //User::factory()->create([
                //    'id' => '5',
                //    'name' => 'Test User 4',
                //    'email' => 'test4@example.com',
                //    'role' => 'user',
                //    'password' => bcrypt('123.321A'),
                //    'email_verified_at' => time(),
                //]);
                //
                //Project::factory()->create([
                //    'name' => 'test Project 1',
                //    'description' => 'first',
                //    'created_by' => '1',
                //]);
                //
                //Project::factory()->create([
                //    'name' => 'test Project 2',
                //    'description' => 'second',
                //    'created_by' => '1',
                //]);
                UserGroup::factory()->create([
                        'name' => 'Example User Group',
                        'created_by' => 1, // Assume user ID 1 exists
                        'users' => [2, 3], // Example user IDs
                ]);
                UserGroup::factory()->create([
                        'name' => 'Example User Group 2',
                        'created_by' => 1, // Assume user ID 1 exists
                        'users' => [2, 3], // Example user IDs
                ]);
                Project::factory()->create([
                        'name' => 'test Project 3',
                        'description' => 'third',
                        'created_by' => '2',
                        'start_date' => Carbon::now()->subDays(10),
                        'group_id' => '1',
                        'project_admin' => ["2"]
                ]);
                Project::factory()->create([
                        'name' => 'test Project 4',
                        'description' => 'fourth',
                        'created_by' => '1',
                        'start_date' => Carbon::now()->subDays(30),
                        'deadline' => Carbon::now()->subDays(5),
                        'group_id' => '1',
                        'project_admin' => ["2"]
                ]);


                $this->call([
                        UserSeeder::class,
                        //        UserGroupSeeder::class,
                        //        ProjectSeeder::class,
                                QuestionSeeder::class,
                        //        AnswersSeeder::class,
                ]);
        }
}
