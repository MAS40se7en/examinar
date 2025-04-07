<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_admin' => 'required|array',
            'group_id' => 'required|exists:user_groups,id',
            'start_date' => 'required|date',
            'deadline' => 'required|date|after:start_date',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The project name is required.',
            'description.required' => 'The project description is required.',
            'project_admin.required' => 'At least one project admin is required.',
            'user_group.required' => 'The user group is required.',
            'user_group.exists' => 'The selected user group does not exist.',
            'start_date.required' => 'The start date is required.',
            'deadline.required' => 'The deadline is required.',
            'deadline.after' => 'The deadline must be after the start date.',
        ];
    }
}
