<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuestionRequest extends FormRequest
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
            'question_body' => 'required|string',
            'question_type' => 'required|string|in:text,multiple_choice,image_highlight',
            'possible_answers' => [
                'sometimes',
                'array',
                'required_if:question_type,multiple_choice',
            ],
            'possible_answers.*' => [
                'required_if:question_type,multiple_choice',
                'string'
            ]
        ];
    }
}
