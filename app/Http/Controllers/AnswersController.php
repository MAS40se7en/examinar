<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAnswerRequest;
use App\Http\Requests\UpdateAnswerRequest;
use App\Models\Answers;
use App\Models\Project;
use App\Models\Question;
use App\Models\SessionQuestionUser;
use Illuminate\Http\Request;

class AnswersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAnswerRequest $request)
{
    $validated = $request->validated();
    $projectId = $request->input('project_id');
    $answers = $validated['answers'];

    $hasAnswers = false;

    foreach ($answers as $answerData) {
        $questionId = $answerData['question_id'];
        $userId = $answerData['user_id'];
        $answerBody = $answerData['answer_body'];
        $submittedAt = $answerData['submitted_at'];

        // Fetch question type
        $questionType = Question::find($questionId)->question_type;

        // Check if answer_body is not empty for multiple_choice and text types
        if (!empty($answerBody) || ($questionType === 'text' && $answerBody !== null)) {
            $hasAnswers = true;

            Answers::updateOrCreate(
                [
                    'question_id' => $questionId,
                    'user_id' => $userId,
                ],
                [
                    'answer_body' => $answerBody,
                    'submitted_at' => $submittedAt,
                ]
            );

            $sessionQuestionUser = SessionQuestionUser::where('question_id', $questionId)
                ->where('user_id', $userId)
                ->first();

            if ($sessionQuestionUser) {
                $sessionQuestionUser->update([
                    'answered_at' => now(),
                ]);
            }
        }
    }

    if ($hasAnswers) {
        return redirect()->route('question.index', ['project' => $projectId])
            ->with('success', 'Your progress has been saved successfully.');
    } else {
        return redirect()->route('question.index', ['project' => $projectId])
            ->with('info', 'No answers were provided. Feel free to come back and complete the questions later.');
    }
}




    /**
     * Display the specified resource.
     */
    public function show(Answers $answer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Answers $answer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAnswerRequest $request, Answers $answer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Answers $answer)
    {
        //
    }
}
