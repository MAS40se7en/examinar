<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Project;

class UserResource extends JsonResource
{

    public static $wrap = false;

    

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $createdProjectsCount = Project::where('created_by', $this->id)->count();
        $adminProjectsCount = Project::where('project_admin', $this->id)->count();
        $totalProjectsCount = $createdProjectsCount + $adminProjectsCount;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'role' => $this->role,
            'email' => $this->email,
            'projects' => $totalProjectsCount,
        ];
    }
}
