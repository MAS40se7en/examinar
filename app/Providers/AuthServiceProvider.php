<?php

namespace App\Providers;

use App\Models\Project;
use App\Models\Question;
use App\Models\User;
use App\Policies\QuestionPolicy;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            return (new MailMessage)->subject('Verify your Email Address')->view('mail.emailVerify', ['url' => $url]);
        });

        // $this->registerPolicies();
//
        //
//
        //Gate::define('manage', function (User $user, Project $project) {
        //    return $user->role === 'admin' || $user->id === $project->project_admin_id;
        //});
//
        //Gate::define('manage-question', function (User $user, Question $question) {
        //    $projectAdminId = $question->project->project_admin_id;
        //    return $user->role === 'admin' || $user->id === $projectAdminId;
        //});
    }
}
