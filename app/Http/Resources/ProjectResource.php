<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'project_admin_name' => $this->projectAdmin->name,
            'group_name' => $this->projectGroup->name,
            'start_date' => $this->start_date,
            'deadline' => $this->deadline,
            'questions_count' => $this->questions_count,
        ];
    }
}
