<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserGroupResource;
use App\Models\ProjectSession;
use App\Http\Requests\StoreProjectSessionRequest;
use App\Http\Requests\UpdateProjectSessionRequest;
use App\Mail\SessionCreated;
use App\Mail\SessionUpdated;
use App\Models\Answers;
use App\Models\Project;
use App\Models\SessionQuestionUser;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;

class ProjectSessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($projectId)
    {
        $project = Project::findOrFail($projectId);
        $currentUser = auth()->user();

        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === 'admin';

        if (!$isProjectAdmin && !$isSystemAdmin) {
            return redirect()->route('error.page', ['prvs' => url()->previous()]);
        }

        $sessions = ProjectSession::where('project_id', $projectId)->withCount('sessionQuestionUsers')->paginate(4);

        foreach ($sessions as $session) {
            $session->canDelete = $session->start_date > now();
        }

        $userGroup = $project->userGroup;
        $totalQuestions = $project->questions()->count();
        $assignedQuestions = SessionQuestionUser::whereHas('question', function ($query) use ($projectId) {
            $query->where('project_id', $projectId);
        })->distinct('question_id')->count('question_id');
        $questionsLeft = $totalQuestions - $assignedQuestions;
        $numberOfUsersInGroup = $userGroup ? count($userGroup->users) : 0;

        $previousSessions = ProjectSession::where('project_id', $projectId)->get();

        if ($previousSessions->isEmpty()) {
            $defaultStartDate = $project->start_date;
            $isStartDateDisabled = true;
        } else {
            $defaultStartDate = null;
            $isStartDateDisabled = false;
        }

        return inertia('Session/Index', [
            'sessions' => $sessions,
            'project' => $project,
            'userGroup' => $userGroup,
            'totalQuestions' => $totalQuestions,
            'assignedQuestions' => $assignedQuestions,
            'questionsLeft' => $questionsLeft,
            'numberOfUsersInGroup' => $numberOfUsersInGroup,
            'defaultStartDate' => $defaultStartDate,
            'isStartDateDisabled' => $isStartDateDisabled,
            'success' => session('success')
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectSessionRequest $request)
    {
        $validated = $request->validated();
        $projectId = $validated['project_id'];
        $currentUser = auth()->user();

        $project = Project::findOrFail($projectId);
        $users = $project->getUserGroupUsersAttribute();

        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === 'admin';

        if (!$isProjectAdmin && !$isSystemAdmin) {
            return redirect()->route('error.page', ['prvs' => url()->previous()]);
        }
        $sessionStartDate = Carbon::parse($validated['start_date']);
        $sessionEndDate = Carbon::parse($validated['end_date']);
        $projectStartDate = Carbon::parse($project->start_date);
        $projectEndDate = Carbon::parse($project->deadline);
        // Get unassigned questions
        $unassignedQuestions = $project->questions()
            ->whereDoesntHave('sessionQuestionUsers')
            ->inRandomOrder()
            ->get();

        $questionsPerUser = $validated['number_of_questions'];
        $totalQuestions = $unassignedQuestions->count();

        if ($sessionStartDate->lt($projectStartDate)) {
            return redirect()->back()->withErrors(['belowStartDateErr' => 'The session start date cannot be before the project start date.']);
        }

        if ($sessionEndDate->gt($projectEndDate)) {
            return redirect()->back()->withErrors(['aboveEndDateErr' => 'The session end date cannot be after the project deadline.']);
        }

        if ($unassignedQuestions->isEmpty() && $project->questions()->count() === 0) {
            return redirect()->back()->withErrors(['noQuestions' => 'No questions in the project.']);
        }
        if ($questionsPerUser > $totalQuestions) {
            return redirect()->back()->withErrors(['insufficientQuestions' => 'Number of questions per user exceeds the total number of available questions.']);
        }
        if ($unassignedQuestions->isEmpty()) {
            return redirect()->back()->withErrors(['emptyError' => 'All questions have already been assigned!']);
        }

        $overlappingSession = $project->sessions()
            ->where(function ($query) use ($request) {
                $query->where('start_date', '<', $request->input('end_date'))
                    ->where('end_date', '>', $request->input('start_date'));
            })->exists();

        if ($overlappingSession) {
            return redirect()->back()->withErrors(['overlap' => 'A session already exists in this time period.']);
        }

        // Create a new session
        $session = ProjectSession::create([
            'project_id' => $projectId,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'number_of_questions' => $validated['number_of_questions'],
        ]);

        $questionsPerUser = $validated['number_of_questions'];
        $totalQuestions = $unassignedQuestions->count();

        // Keep track of assigned questions
        $assignedQuestions = collect();

        foreach ($users as $user) {
            // Assign unique questions first
            $userQuestions = $unassignedQuestions->splice(0, min($questionsPerUser, $totalQuestions));

            // If not enough unique questions, repeat some of the already assigned ones
            while ($userQuestions->count() < $questionsPerUser) {
                // Exclude already assigned questions for this user to avoid exact duplicates
                $remainingQuestions = $assignedQuestions->diff($userQuestions);
                if ($remainingQuestions->isEmpty()) {
                    // If no remaining questions are available, reuse any question from the assigned pool
                    $remainingQuestions = $assignedQuestions;
                }
                $userQuestions->push($remainingQuestions->random());
            }

            // Assign questions to the user in this session
            foreach ($userQuestions as $question) {
                SessionQuestionUser::create([
                    'project_session_id' => $session->id,
                    'question_id' => $question->id,
                    'user_id' => $user->id,
                ]);
                $assignedQuestions->push($question);
            }
            Mail::to($user->email)->send(new SessionCreated($session, $user, $project));
        }

        // If all questions are now assigned, disable future session creation
        if ($project->questions()->whereDoesntHave('sessionQuestionUsers')->doesntExist()) {
            return to_route('session.index', ['project' => $projectId])
                ->with('success', 'Questions Added Successfully. All questions have been assigned.');
        }

        return to_route('session.index', ['project' => $projectId])
            ->with('success', 'Questions Added Successfully');
    }



    /**
     * Display the specified resource.
     */
    public function show(ProjectSession $session)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProjectSession $session)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectSessionRequest $request, ProjectSession $session)
    {
        $validated = $request->validated();
        $currentUser = auth()->user();

        $project = $session->project;
        $users = $project->getUserGroupUsersAttribute();

        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === 'admin';

        if (!$isProjectAdmin && !$isSystemAdmin) {
            return redirect()->route('error.page', ['prvs' => url()->previous()]);
        }

        $sessionStartDate = Carbon::parse($validated['start_date']);
        $sessionEndDate = Carbon::parse($validated['end_date']);
        $projectStartDate = Carbon::parse($project->start_date);
        $projectEndDate = Carbon::parse($project->deadline);

        if ($sessionStartDate->lt($projectStartDate)) {
            return redirect()->back()->withErrors(['belowStartDateErr' => 'The session start date cannot be before the project start date.']);
        }

        if ($sessionEndDate->gt($projectEndDate)) {
            return redirect()->back()->withErrors(['aboveEndDateErr' => 'The session end date cannot be after the project deadline.']);
        }

        // Check for overlapping sessions
        $overlappingSession = $project->sessions()
            ->where('id', '!=', $session->id)
            ->where(function ($query) use ($request) {
                $query->where('start_date', '<', $request->input('end_date'))
                    ->where('end_date', '>', $request->input('start_date'));
            })->exists();

        if ($overlappingSession) {
            return redirect()->back()->withErrors(['overlap' => 'A session already exists in this time period.']);
        }

        // Check if the number of questions per user exceeds total available questions
        $newQuestionsPerUser = $validated['number_of_questions'];
        $totalQuestions = $project->questions()->count();

        if ($newQuestionsPerUser > $totalQuestions) {
            return redirect()->back()->withErrors(['insufficientQuestions' => 'Number of questions per user exceeds the total number of available questions.']);
        }

        // Update the session details
        $session->update([
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'number_of_questions' => $validated['number_of_questions'],
        ]);

        // Clear previous assignments and reassign questions
        $session->sessionQuestionUsers()->delete();

        // Get unassigned questions again
        $unassignedQuestions = $project->questions()
            ->whereDoesntHave('sessionQuestionUsers')
            ->inRandomOrder()
            ->get();

        // Keep track of assigned questions
        $assignedQuestions = collect();

        foreach ($users as $user) {
            // Assign unique questions first
            $userQuestions = $unassignedQuestions->splice(0, min($newQuestionsPerUser, $unassignedQuestions->count()));

            // If not enough unique questions, repeat some of the already assigned ones
            while ($userQuestions->count() < $newQuestionsPerUser) {
                $remainingQuestions = $assignedQuestions->diff($userQuestions);
                if ($remainingQuestions->isEmpty()) {
                    $remainingQuestions = $assignedQuestions;
                }
                $userQuestions->push($remainingQuestions->random());
            }

            foreach ($userQuestions as $question) {
                SessionQuestionUser::create([
                    'project_session_id' => $session->id,
                    'question_id' => $question->id,
                    'user_id' => $user->id,
                ]);
                $assignedQuestions->push($question);
            }

            // Notify user about the updated session
            Mail::to($user->email)->send(new SessionUpdated($session, $user, $project));
        }

        // Recalculate the number of assigned and unassigned questions
        $assignedQuestionsCount = SessionQuestionUser::whereHas('question', function ($query) use ($project) {
            $query->where('project_id', $project->id);
        })->distinct('question_id')->count('question_id');

        $questionsLeft = $totalQuestions - $assignedQuestionsCount;

        // Return to session index with updated counts
        return to_route('session.index', ['project' => $project->id])
            ->with('success', 'Session updated successfully.')
            ->with('assignedQuestionsCount', $assignedQuestionsCount)
            ->with('questionsLeft', $questionsLeft);
    }







    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, ProjectSession $session)
    {
        $currentUser = auth()->user();

        // Check if the session belongs to the project
        if ($session->project_id !== $project->id) {
            return Redirect::back()->withErrors('Session does not belong to this project.');
        }

        // Check if the current user is authorized to perform the deletion
        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === 'admin';

        if (!$isProjectAdmin && !$isSystemAdmin) {
            return redirect()->route('error.page', ['prvs' => url()->previous()]);
        }

        // Get all question IDs related to this session
        $questionIds = $session->questions()->pluck('questions.id'); // Specify table name

        // Delete all entries in the session_question_user table related to the questions in this session
        DB::table('session_question_users')
            ->whereIn('question_id', $questionIds)
            ->delete();

        // Delete all answers related to the questions in this session
        Answers::whereIn('question_id', $questionIds)->delete();

        // Finally, delete the session itself
        $session->delete();

        return to_route('session.index', ['project' => $project->id])
            ->with('success', 'Session and related data deleted successfully.');
    }


}
