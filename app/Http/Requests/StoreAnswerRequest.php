<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAnswerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'project_id' => 'required|exists:projects,id',
            'answers' => 'sometimes|array',
            'answers.*.question_id' => 'required_with:answers.*|exists:questions,id',
            'answers.*.user_id' => 'required_with:answers.*|exists:users,id',
            'answers.*.answer_body' => 'nullable|string',
            'answers.*.submitted_at' => 'required_with:answers.*|date',
        ];
    }
}
