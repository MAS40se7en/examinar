<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Http\Resources\UserResource;
use App\Models\Answers;
use App\Models\Project;
use App\Models\ProjectSession;
use App\Models\Question;
use App\Models\SessionQuestionUser;
use App\Models\User;
use App\Models\UserGroup;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Project $project, ProjectSession $session)
    {
        $latestSession = ProjectSession::where('project_id', $project->id)
            ->orderBy('start_date')
            ->first();
        $userId = auth()->id();
        $isAdmin = auth()->user()->role === 'admin';


        if (!$latestSession && !$isAdmin) {
            return redirect()->back()->withErrors('No Sessions in the Project');
        }

        if (!$isAdmin && !$latestSession->isActive()) {
            return redirect()->back()->withErrors('You cannot access the questions until the start date of the session.');
        }


        if (!$isAdmin) {
            $query = SessionQuestionUser::where('project_session_id', $latestSession->id);
            $query->where('user_id', $userId);
            $questions = $query->with('question')->get()->pluck('question');
        } else {
            $questions = $project->questions()->get();
        }


        $questionIds = $questions->pluck('id');
        $savedAnswers = Answers::whereIn('question_id', $questionIds)
            ->where('user_id', $userId)
            ->get();

        return inertia("Question/Index", [
            'project' => $project,
            'questions' => $questions,
            'success' => session('success'),
            'savedAnswers' => $savedAnswers,
            'info' => session('info'),
            'session' => $latestSession,
        ]);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $currentUser = auth()->user();
        $projectId = $request->query('project_id');
        $questions = Question::where('project_id', $projectId)->get();

        if (is_null($projectId)) {
            return redirect()->back()->with('error', 'Project ID is missing');
        }
        $project = Project::find($projectId);

        if (!$project) {
            return redirect()->back()->with('error', 'Project not found');
        }

        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === 'admin';

        if (!$isProjectAdmin && !$isSystemAdmin) {
            return redirect()->route('error.page', ['prvs' => url()->previous()]);
        }

        $project->load('userGroup', 'createdBy');
        return inertia('Question/Create', [
            'projectId' => $projectId,
            'project' => $project,
            'questions' => $questions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreQuestionRequest $request)
    {
        $currentUser = auth()->user();
        $validatedData = $request->validated();
        $projectId = $request->input('project_id');

        $project = Project::find($projectId);

        if (!$project) {
            return redirect()->back()->with('error', 'Project not found');
        }

        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === 'admin';

        if (!$isProjectAdmin && !$isSystemAdmin) {
            return redirect()->route('error.page', ['prvs' => url()->previous()]);
        }

        foreach ($validatedData['questions'] as $question) {
            Question::create([
                'project_id' => $projectId,
                'question_body' => $question['question_body'],
                'question_type' => $question['question_type'],
                'possible_answers' => $question['question_type'] === 'multiple_choice' ? json_encode($question['possible_answers']) : null
            ]);
        }

        foreach ($project->sessions as $session) {
            $session->handleNewAndDuplicateQuestions();
        }
    

        return to_route('project.show', ['project' => $projectId])->with('success', 'Questions Added Successfully');
    }


    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {
        //show questions of the current project
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question)
    {
        $currentUser = auth()->user();

        $projectId = $question->project_id;

        $project = Project::find($projectId);

        if (!$project && !$question) {
            return redirect()->back()->with('error', 'Project not found');
        }

        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === 'admin';

        if (!$isProjectAdmin && !$isSystemAdmin) {
            return redirect()->route('error.page', ['prvs' => url()->previous()]);
        }
        return inertia("Question/Edit", [
            'question' => $question,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuestionRequest $request, Question $question)
    {
        $validatedData = $request->validated();
        $currentUser = auth()->user();

        $projectId = $question->project_id;

        $project = Project::find($projectId);

        if (!$project && !$question) {
            return redirect()->back()->with('error', 'Project or Question not found');
        }

        $isProjectAdmin = in_array($currentUser->id, $project->project_admin);
        $isSystemAdmin = $currentUser->role === 'admin';

        if (!$isProjectAdmin && !$isSystemAdmin) {
            return redirect()->route('error.page', ['prvs' => url()->previous()]);
        }

        $question->update([
            'question_body' => $validatedData['question_body'],
            'question_type' => $validatedData['question_type'],
            'possible_answers' => $validatedData['question_type'] === 'multiple_choice'
                ? json_encode($validatedData['possible_answers'])
                : null,
        ]);

        return redirect()->route('project.show', ['project' => $question->project_id])
            ->with('success', 'Question Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {
        //
        if (!$question) {
            return redirect()->back()->with('error', 'Question not found');
        }
        $projectId = $question->project_id;
        $id = $question->id;
        $question->delete();


    }
}
