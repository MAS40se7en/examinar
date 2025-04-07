<?php

use App\Http\Controllers\AnswersController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ErrorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectSessionController;
use App\Http\Controllers\QuestionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserGroupController;
use Illuminate\Support\Facades\Mail;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/users/{id}', [UserController::class, 'userSearch']);
    Route::get('/project/{project}', [ProjectController::class, 'show'])->name('project.show');
    Route::get('/question', [QuestionController::class, 'create'])->name('question.create');
    Route::post('/question', [QuestionController::class, 'store'])->name('questions.store');
    Route::get('/questions/{question}', [QuestionController::class, 'edit'])->name('question.edit');
    Route::delete('/questions/{question}', [QuestionController::class, 'destroy'])->name("question.destroy");
    Route::patch('/question/update/{question}', [QuestionController::class, 'update'])->name('question.update');
    Route::get('/project/{project}/questions', [QuestionController::class, 'index'])->name('question.index');
    Route::get('/projects/search-admin', [ProjectController::class, 'searchAdmin'])->name('projects.searchAdmin');
    Route::get('/dashboard/administered', [DashboardController::class, 'showProjects'])->name('project.admin');
    Route::post('/answer', [AnswersController::class, 'store'])->name('answers.store');
    Route::post('/project/{project}/update-allow-edit', [ProjectController::class, 'updateAllowEdit'])->name('project.updateAllowEdit');
    Route::get('/projects/completed', [DashboardController::class, 'getCompletedProjects'])->name('dashboard.completed_projects');
    Route::get('/user/{user}/answers/{project}', [ProjectController::class, 'showAnswers'])->name('user.answers');
    Route::get('/project/{project}/export', [ProjectController::class, 'export'])->name('project.export');
    Route::post('/project/{project}/session', [ProjectSessionController::class, 'store'])->name('session.store');
    Route::patch('/project/edit/sessions/{session}', [ProjectSessionController::class, 'update'])->name('session.update');
    Route::get('/project/{project}/sessions', [ProjectSessionController::class, 'index'])->name('session.index');
    Route::delete('/project/{project}/sessions/{session}', [ProjectSessionController::class, 'destroy'])->name('session.destroy');
    Route::post('/projects/{project}/complete', [ProjectController::class, 'markAsCompleted'])->name('project.complete');
    Route::post('/projects/{project}/incomplete', [ProjectController::class, 'markAsIncomplete'])->name('project.incomplete');
    Route::get('/err', [ErrorController::class, 'showErrorPage'])->name('error.page');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('project.edit');
    Route::patch('/projects/{project}', [ProjectController::class, 'update'])->name("project.update");
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name("project.destroy");
    Route::get('/users', [UserController::class, 'index'])->name('user.index');
    Route::get('/user/{user}', [UserController::class, 'show'])->name('user.show');
    Route::get('/users/groups', [UserController::class, 'index'])->name('user.group');
    Route::patch('/users/update/{user}', [UserController::class, 'update'])->name('user.update');
    Route::patch('/users/{user}', [UserController::class, 'updatePassword'])->name('user.password_update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('user.destroy');
    Route::get('/project', [ProjectController::class, 'create'])->name('project.create');
    Route::post('/project', [ProjectController::class, 'store'])->name('projects.store');
    Route::post('/usergroups', [UserGroupController::class, 'store'])->name('groups.store');
    Route::get('/usergroups', [UserGroupController::class, 'index'])->name('groups.index');
    Route::get('/usergroups/{group}', [UserGroupController::class, 'index'])->name('group.edit');
    Route::patch('/usergroups/{group}', [UserGroupController::class, 'update'])->name("group.update");
    Route::delete('/usergroups/{group}', [UserGroupController::class, 'destroy'])->name('group.destroy');
});




require __DIR__ . '/auth.php';