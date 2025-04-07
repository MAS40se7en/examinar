<?php

namespace App\Http\Controllers;

use App\Exports\ResultsDataExport;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\UserGroupResource;
use App\Http\Resources\UserResource;
use App\Mail\ProjectAdminRemoved;

use App\Mail\ProjectCreatedNotification;
use App\Mail\ProjectUpdated;
use App\Models\Project;
use App\Models\User;
use App\Models\UserGroup;
use App\Mail\ProjectAdminAssigned;
use App\Models\Answers;
use App\Models\ProjectSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Maatwebsite\Excel\Facades\Excel;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $currentUser = auth()->user();

        $userGroups = UserGroup::all();

        $isSystemAdmin = $currentUser->role === 'admin';

        if (!$isSystemAdmin) {
            return redirect()->back()->with('error', 'You do not have permission to access this function');
        }

        $users = User::where('id', '!=', $currentUser->id)->whereNotNull('email_verified_at')->get();

        return inertia('Project/Create', [
            'users' => UserResource::collection($users),
            'userGroups' => UserGroupResource::collection($userGroups)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $data = $request->validated();

        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        $currentUser = auth()->user();

        $isSystemAdmin = $currentUser->role === 'admin';

        if (!$isSystemAdmin) {
            return redirect()->back()->with('error', 'You do not have permission to access this function');
        }

        $projectAdminIds = $request->input('project_admin');
        $userGroup = UserGroup::find($request->input('group_id'));

        if (!$userGroup) {
            return back()->withErrors(['group_id' => 'Invalid user group selected'])->withInput();
        }

        $data['group_id'] = $userGroup->id;
        $project = Project::create($data);

        $projectAdmins = User::whereIn('id', $projectAdminIds)->get();
        foreach ($projectAdmins as $admin) {
            Mail::to($admin->email)->send(new ProjectAdminAssigned($project, $admin));
        }

        $groupUsers = User::whereIn('id', $userGroup->users)->get();
        foreach ($groupUsers as $user) {
            Mail::to($user->email)->send(new ProjectCreatedNotification($project, $user, $userGroup));
        }

        return to_route('dashboard')->with('success', 'Project created successfully');
    }



    public function searchAdmin(Request $request)
    {
        $request->validate([
            'project_admin' => 'required|integer|exists:users,id',
        ]);

        $adminId = $request->input('project_admin');
        $admin = User::find($adminId);

        if (!$admin) {
            return redirect()->back()->with('error', 'Project admin not found.');
        }

        $projects = Project::where('project_admin', $adminId)->get();

        return view('project.show', compact('projects', 'admin'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $currentUser = auth()->user();
        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === "admin";
        $projectAdminNames = $project->projectAdmins;
        $questions = $project->questions()->get();
        $userGroupUsers = $project->userGroupUsers;
        $numberOfQuestions = $questions->count();

        $sessions = ProjectSession::where('project_id', $project->id)->get();
        $totalSessions = $sessions->count();
        $sessionProgress = [];
        $completedUsers = [];
        $incompleteUsers = [];
        $sessionCompletedUsers = [];
        $userSessionsCompleted = [];
        $sessionCompletionStatus = [];
        $userSessionsIncomplete = [];
        $totalAnsweredQuestionsByUsers = 0;
        $userCompletionPercentage = 0;
        $sessionCompletionStatus = [];
        $sessionsWithProgress = 0;
        $canMarkAsCompleted = true;

        // Determine the current active session
        $currentSession = $sessions->first(function ($session) {
            return $session->isActive();
        });

        // Initialize the current session data
        $assignedQuestionsCount = 0;

        if ($currentSession) {
            $assignedQuestionsCount = $currentSession->sessionQuestionUsers()
                ->where('user_id', $currentUser->id)
                ->count();
        }

        foreach ($userGroupUsers as $user) {
            $totalAnsweredQuestions = 0;
            $userSessionsCompleted[$user->id] = 0;
            $userSessionsIncomplete[$user->id] = 0;

            if ($currentSession) {
                // Fetch questions assigned to the user in the current session
                $sessionQuestions = $currentSession->sessionQuestionUsers()
                    ->where('user_id', $user->id)
                    ->get(['question_id', 'answered_at']);

                // Fetch the answers to these questions
                $userAnswers = Answers::where('user_id', $user->id)
                    ->whereIn('question_id', $sessionQuestions->pluck('question_id'))
                    ->get();

                // Filter out questions with non-empty answers
                $answeredSessionQuestionsCount = $userAnswers->filter(function ($answer) {
                    return !empty($answer->answer_body);
                })->count();

                $sessionQuestionsCount = $sessionQuestions->count();
                $totalAnsweredQuestions += $answeredSessionQuestionsCount;
                $totalAnsweredQuestionsByUsers += $answeredSessionQuestionsCount;

                if ($answeredSessionQuestionsCount > 0 && $answeredSessionQuestionsCount === $sessionQuestionsCount) {
                    $sessionsWithProgress++;
                    $canMarkAsCompleted = true;
                    if (!isset($sessionCompletedUsers[$currentSession->id])) {
                        $sessionCompletedUsers[$currentSession->id] = [];
                    }
                    $sessionCompletedUsers[$currentSession->id][] = $user;
                    $userSessionsCompleted[$user->id]++;
                } else {
                    $userSessionsIncomplete[$user->id] = true;
                }

                $sessionCompletionStatus[$currentSession->id][$user->id] = $answeredSessionQuestionsCount > 0;
                $sessionCompletionPercentage = $sessionQuestionsCount > 0
                    ? ($answeredSessionQuestionsCount / $sessionQuestionsCount) * 100
                    : 0;

                $sessionProgress[$currentSession->id][$user->id] = $sessionCompletionPercentage;
            }

            if ($userSessionsCompleted[$user->id] === $totalSessions) {
                $completedUsers[] = $user;
            } else {
                $incompleteUsers[] = $user;
                $canMarkAsCompleted = false;
            }

            if ($user->id === $currentUser->id) {
                // Fetch answers for the current user
                $assignedQuestions = $sessions->flatMap(function ($session) use ($currentUser) {
                    return $session->sessionQuestionUsers()->where('user_id', $currentUser->id)->get();
                });

                $userAnswers = Answers::where('user_id', $currentUser->id)
                    ->whereIn('question_id', $assignedQuestions->pluck('question_id'))
                    ->get();

                $totalAssignedQuestions = $assignedQuestions->count();
                $answeredAssignedQuestions = $userAnswers->filter(function ($answer) {
                    return !empty($answer->answer_body);
                })->count();

                $userCompletionPercentage = $totalAssignedQuestions > 0
                    ? ($answeredAssignedQuestions / $totalAssignedQuestions) * 100
                    : 0;
            }
        }

        $hasPassedDeadline = $project->deadline && $project->deadline < now();

        $completedUsersCount = count($completedUsers);
        $totalUsers = $userGroupUsers->count();
        $sessionCompletionPercentage = $totalUsers > 0 ? ($completedUsersCount / $totalUsers) * 100 : 0;

        // Calculate project completion percentage
        $totalProjectAssignments = 0;
        $answeredProjectAssignments = 0;

        foreach ($sessions as $session) {
            foreach ($userGroupUsers as $user) {
                if ($session === $currentSession) {
                    $sessionQuestions = $session->sessionQuestionUsers()->where('user_id', $user->id)->get();
                    $totalProjectAssignments += $sessionQuestions->count();
                    $userAnswers = Answers::where('user_id', $user->id)
                        ->whereIn('question_id', $sessionQuestions->pluck('question_id'))
                        ->get();
                    $answeredProjectAssignments += $userAnswers->filter(function ($answer) {
                        return !empty($answer->answer_body);
                    })->count();
                }
            }
        }

        $projectCompletionPercentage = $totalProjectAssignments > 0
            ? ($answeredProjectAssignments / $totalProjectAssignments) * 100
            : 0;

        $latestSession = $sessions->sortBy('start_date')->first();
        $isSessionStarted = $latestSession ? $latestSession->start_date <= now() : false;
        $isSessionAccessible = $latestSession ? $latestSession->isActive() : false;

        $sortedSessions = $sessions->sortBy('start_date');
        $latestSession = $sortedSessions->first();
        $nextSession = $sortedSessions->slice(1)->first();
        $isNextSessionAccessible = $nextSession ? $nextSession->start_date <= now() : false;

        $canAccessSession = $isSessionStarted || $isSystemAdmin;

        $questionsForCurrentUser = collect();
        if ($canAccessSession && $currentSession) {
            $questionsForCurrentUser = $currentSession->sessionQuestionUsers()
                ->where('user_id', $currentUser->id)
                ->with('question')
                ->get();
        }

        if ($currentSession) {
            $sessionProgress = [
                $currentSession->id => $sessionProgress[$currentSession->id] ?? []
            ];
        } else {
            $sessionProgress = [];
        }

        $answeredQuestionsCountForCurrentUser = $questionsForCurrentUser->whereNotNull('answered_at')->count();
        $totalQuestionsForCurrentUser = $questionsForCurrentUser->count();
        $sessionCompleteNoEdit = $totalQuestionsForCurrentUser > 0 && $answeredQuestionsCountForCurrentUser === $totalQuestionsForCurrentUser && $isSessionAccessible && !$project->allow_edit;

        $showStartButton = $currentSession && $isSessionStarted && $isSessionAccessible;
        $showContinueButton = $totalQuestionsForCurrentUser > 0 && $answeredQuestionsCountForCurrentUser > 0 && $answeredQuestionsCountForCurrentUser < $totalQuestionsForCurrentUser && $isSessionAccessible;
        $showEditButton = $totalQuestionsForCurrentUser > 0 && $answeredQuestionsCountForCurrentUser === $totalQuestionsForCurrentUser && $project->allow_edit && $isSessionAccessible;

        $project->load("createdBy", "userGroup");
        $allowEdit = $project->allow_edit;
        $completed = $project->completed || $hasPassedDeadline;

        return inertia('Project/Index', [
            'project' => $project,
            'questions' => $questions,
            'isSystemAdmin' => $isSystemAdmin,
            'projectAdminNames' => $projectAdminNames,
            'userGroupUsers' => $userGroupUsers,
            'completedUsers' => $completedUsers,
            'incompleteUsers' => $incompleteUsers,
            'sessionCompletedUsers' => $sessionCompletedUsers,
            'hasStartedProject' => $answeredQuestionsCountForCurrentUser > 0,
            'success' => session('success'),
            'editSuccess' => session('editSuccess'),
            'numberOfQuestions' => $numberOfQuestions,
            'isSessionStarted' => $isSessionStarted,
            'showStartButton' => $showStartButton,
            'showContinueButton' => $showContinueButton,
            'showEditButton' => $showEditButton,
            'sessionCompleteNoEdit' => $sessionCompleteNoEdit,
            'sessions' => $sessions,
            'totalAnsweredQuestions' => $totalAnsweredQuestionsByUsers,
            'projectCompletionPercentage' => $projectCompletionPercentage,
            'nextSessionStartDate' => $nextSession ? $nextSession->start_date : null,
            'isNextSessionAccessible' => $isNextSessionAccessible,
            'sessionProgress' => $sessionProgress,
            'currentUser' => $currentUser,
            'completed' => $completed,
            'canMarkAsComplete' => $canMarkAsCompleted,
            'assignedQuestionsCount' => $assignedQuestionsCount
        ]);
    }



    public function markAsCompleted(Project $project)
    {
        $currentUser = auth()->user();

        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === "admin";

        if (!$isProjectAdmin && !$isSystemAdmin) {
            return redirect()->route('dashboard')->withErrors('notAllowed', 'You cannot perform this function!');
        }

        $project->completed = true;
        $project->save();

        return redirect()->route('project.show', $project)->with('success', 'Project marked as completed.');
    }

    public function markAsIncomplete(Project $project) {
        $currentUser = auth()->user();

        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === "admin";

        if (!$isProjectAdmin && !$isSystemAdmin) {
            return redirect()->route('dashboard')->withErrors('notAllowed', 'You cannot perform this function!');
        }

        $project->completed = false;
        $project->save();

        return redirect()->route('project.show', $project)->with('success', 'Project marked as incomplete.');

    }



    /**
     * update project edit
     */



    public function updateAllowEdit(Request $request, Project $project)
    {
        $currentUser = auth()->user();

        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === 'admin';

        if (!$isProjectAdmin && !$isSystemAdmin) {
            return redirect()->back()->with('error', 'You do not have permission to access this function');
        }

        $request->validate([
            'allow_edit' => 'required|boolean',
        ]);

        $allowEdit = $request->input('allow_edit');
        $project->update([
            'allow_edit' => $allowEdit
        ]);


        return redirect()->route('project.show', $project->id)
            ->with('editSuccess', $allowEdit
                ? 'Editing is now allowed for users.'
                : 'Editing has been disabled for users.');
    }


    public function export(Project $project)
    {
        $currentUser = auth()->user();

        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === 'admin';

        if (!$isProjectAdmin && !$isSystemAdmin) {
            return redirect()->route('error.page', ['prvs' => url()->previous()]);
        }

        return Excel::download(new ResultsDataExport($project), 'Results.xlsx');
    }

    /**
     * Get user answers
     */

    public function showAnswers(User $user, Project $project)
    {
        $currentUser = auth()->user();

        if (!$project) {
            return redirect()->back()->with('error', 'Project not found');
        }

        // Check if the current user is in the project_admin array or has the role of admin
        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === 'admin';

        if (!$isProjectAdmin && !$isSystemAdmin) {
            return redirect()->route('error.page', ['prvs' => url()->previous()]);
        }

        $answers = Answers::where('user_id', $user->id)
            ->whereHas('question', function ($query) use ($project) {
                $query->where('project_id', $project->id);
            })
            ->with('question')
            ->paginate(12);

        return inertia('Project/UserAnswers', [
            'answers' => $answers,
            'user' => $user,
            'project' => $project,
        ]);
    }




    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
        $currentUser = auth()->user();

        if (!$project) {
            return redirect()->back()->with('error', 'Project not found');
        }

        // Check if the current user is in the project_admin array or has the role of admin
        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === 'admin';

        if (!$isProjectAdmin && !$isSystemAdmin) {
            return redirect()->route('error.page', ['prvs' => url()->previous()]);
        }
        $project->load('userGroup');
        $projectAdmins = $project->projectAdmins;
        $currentUser = auth()->user();
        $users = User::where('id', '!=', $currentUser->id)->whereNotNull('email_verified_at')->get();
        $userGroups = UserGroup::all();

        return inertia("Project/Edit", [
            'project' => $project,
            'projectAdmins' => $projectAdmins,
            'users' => UserResource::collection($users),
            'userGroups' => UserGroupResource::collection($userGroups)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        $data = $request->validated();
        $data['updated_by'] = Auth::id();
        $currentUser = auth()->user();

        if (!$project) {
            return redirect()->back()->with('error', 'Project not found');
        }

        // Check if the current user is in the project_admin array or has the role of admin
        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === 'admin';

        if (!$isProjectAdmin && !$isSystemAdmin) {
            return redirect()->route('error.page', ['prvs' => url()->previous()]);
        }

        $currentProjectAdminIds = $project->project_admin;
        $newProjectAdminIds = $request->input('project_admin');

        $currentGroupId = $project->group_id;
        $newGroupId = $request->input('group_id');

        $project->update($data);

        // Handle admin updates
        $removedAdmins = array_diff($currentProjectAdminIds, $newProjectAdminIds);
        $newAdmins = array_diff($newProjectAdminIds, $currentProjectAdminIds);

        foreach ($removedAdmins as $adminId) {
            $admin = User::find($adminId);
            if ($admin) {
                Mail::to($admin->email)->send(new ProjectAdminRemoved($project, $admin));
            }
        }

        foreach ($newAdmins as $adminId) {
            $admin = User::find($adminId);
            if ($admin) {
                Mail::to($admin->email)->send(new ProjectAdminAssigned($project, $admin));
            }
        }

        // Notify existing admins about the project update
        $existingAdminsToUpdate = array_intersect($currentProjectAdminIds, $newProjectAdminIds);
        foreach ($existingAdminsToUpdate as $adminId) {
            $admin = User::find($adminId);
            if ($admin) {
                Mail::to($admin->email)->send(new ProjectUpdated($project, $admin, true)); // Pass true for isAdmin
            }
        }


        if ($currentGroupId !== $newGroupId) {

            $newGroup = UserGroup::find($newGroupId);
            if ($newGroup) {
                $newGroupUsers = User::whereIn('id', $newGroup->users)->get();
                foreach ($newGroupUsers as $user) {
                    Mail::to($user->email)->send(new ProjectCreatedNotification($project, $user, $newGroup));
                }
            }
        } else {

            $currentGroup = UserGroup::find($currentGroupId);
            if ($currentGroup) {
                $currentGroupUsers = User::whereIn('id', $currentGroup->users)->get();
                foreach ($currentGroupUsers as $user) {
                    Mail::to($user->email)->send(new ProjectUpdated($project, $user, false));
                }
            }
        }

        return redirect()->route('project.show', $project->id)
            ->with("success", "Project \"{$project->name}\" was updated successfully.");
    }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
        $currentUser = auth()->user();

        if (!$project) {
            return redirect()->back()->with('error', 'Project not found');
        }

        // Check if the current user is in the project_admin array or has the role of admin
        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === 'admin';

        if (!$isProjectAdmin && !$isSystemAdmin) {
            return redirect()->route('error.page', ['prvs' => url()->previous()]);
        }
        $name = $project->name;
        $project->delete();

        return to_route('dashboard')->with("success", "Project \"{$name}\" was deleted successfully.");
    }
}
