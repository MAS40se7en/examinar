<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use App\Models\UserGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    //
    public function index(Request $request)
    {
        $currentUser = auth()->user();

        $query = Project::query();
        $sortField = $request->input('sort_field', 'start_date');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = $request->input('search');

        if ($search) {
            $query->where('projects.name', 'like', "%{$search}%")
                ->orWhereHas('userGroup', function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%");
                })->orWhere(function ($query) use ($search) {
                    $query->whereExists(function ($subQuery) use ($search) {
                        $subQuery->select(DB::raw(1))
                            ->from('users')
                            ->whereRaw("json_contains(projects.project_admin, CAST(users.id AS JSON))")
                            ->where('users.name', 'like', "%{$search}%");
                    });
                });
        }


        if ($sortField === 'user_group') {
            $query->join('user_groups', 'projects.group_id', '=', 'user_groups.id')
                ->select('projects.*', 'user_groups.name as user_group_name')
                ->orderBy('user_group_name', $sortDirection);

        } else {
            $query->orderBy($sortField, $sortDirection);
        }


        if ($currentUser->role === 'admin') {

            $projects = $query->with('userGroup')->paginate(15);
            foreach ($projects as $project) {
                $project->project_admins = $project->project_admin
                    ? User::whereIn('id', $project->project_admin)->get()
                    : collect();
            }
        } else {

            $projects = $query->where(function ($q) use ($currentUser) {
                $q->whereJsonDoesntContain('project_admin', $currentUser->id)
                    ->whereHas('userGroup', function ($query) use ($currentUser) {
                        $query->whereJsonContains('users', $currentUser->id);
                    });
            })->with('userGroup')->paginate(15);

            foreach ($projects as $project) {
                $project->project_admins = $project->project_admin
                    ? User::whereIn('id', $project->project_admin)->get()
                    : collect();
            }
        }

        return inertia("Dashboard", [
            "projects" => $projects,
            'queryParams' => $request->query() ?: null,
            "success" => session('success')
        ]);
    }







    public function showProjects(Request $request)
    {
        $currentUser = auth()->user();
        $search = $request->input('search');
        $sortField = $request->input('sort_field', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');

        $currentUserId = $currentUser->id;

        $query = Project::whereJsonContains('project_admin', $currentUserId)
            ->with(['createdBy', 'userGroup'])
            ->when($search, function ($query, $searchTerm) {
                $query->where(function ($query) use ($searchTerm) {
                    $query->where('name', 'like', "%{$searchTerm}%")
                        ->orWhereHas('createdBy', function ($query) use ($searchTerm) {
                            $query->where('name', 'like', "%{$searchTerm}%");
                        })
                        ->orWhereHas('userGroup', function ($query) use ($searchTerm) {
                            $query->where('name', 'like', "%{$searchTerm}%");
                        });
                });
            });


        if ($sortField === 'user_group') {
            $query->join('user_groups', 'projects.group_id', '=', 'user_groups.id')
                ->select('projects.*', 'user_groups.name as user_group_name')
                ->orderBy('user_group_name', $sortDirection);
        } elseif ($sortField === 'created_by') {
            $query->join('users as created_by', 'projects.created_by', '=', 'created_by.id')
                ->select('projects.*', 'created_by.name as created_by_name')
                ->orderBy('created_by_name', $sortDirection);
        } else {
            $query->orderBy($sortField, $sortDirection);
        }


        $administeredProjects = $query->paginate(15);

        return inertia('DashboardUIs/ProjectAdminDashboard', [
            'administeredProjects' => $administeredProjects,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Get completed Projects
     */

     public function getCompletedProjects(Request $request)
     {
         $currentUser = auth()->user();
         $isAdmin = $currentUser->role === 'admin';
         $currentUserId = $currentUser->id;
         $now = now();
     
         $query = Project::query()
             ->where(function ($query) use ($now) {
                 $query->where('completed', true)
                     ->orWhere('deadline', '<', $now);
             });
     
         if (!$isAdmin) {
             $query->whereJsonContains('project_admin', $currentUserId);
         }
     
         $sortField = $request->input('sort_field', 'start_date');
         $sortDirection = $request->input('sort_direction', 'desc');
         $search = $request->input('search');
     
         if ($search) {
             $query->where(function ($query) use ($search) {
                 $query->where('projects.name', 'like', "%{$search}%")
                     ->orWhereHas('createdBy', function ($query) use ($search) {
                         $query->where('name', 'like', "%{$search}%");
                     })
                     ->orWhereHas('userGroup', function ($query) use ($search) {
                         $query->where('name', 'like', "%{$search}%");
                     })
                     ->orWhere(function ($query) use ($search) {
                         $query->whereExists(function ($subQuery) use ($search) {
                             $subQuery->select(DB::raw(1))
                                 ->from('users')
                                 ->whereRaw("json_contains(projects.project_admin, CAST(users.id AS JSON))")
                                 ->where('users.name', 'like', "%{$search}%");
                         });
                     });
             });
         }
     
         if ($sortField === 'user_group') {
             $query->join('user_groups', 'projects.group_id', '=', 'user_groups.id')
                 ->select('projects.*', 'user_groups.name as user_group_name')
                 ->orderBy('user_group_name', $sortDirection);
         } else {
             $query->orderBy($sortField, $sortDirection);
         }
     
         $completedProjects = $query->withCount([
             'questions',
             'questions as answered_questions_count' => function ($query) use ($currentUser) {
                 $query->whereHas('answers', function ($query) use ($currentUser) {
                     $query->where('user_id', $currentUser->id);
                 });
             }
         ])->paginate(15);
     
         foreach ($completedProjects as $project) {
             $project->project_admins = $project->project_admin
                 ? User::whereIn('id', $project->project_admin)->get()
                 : collect();
         }
     
         return inertia('DashboardUIs/CompletedDashboard', [
             'completedProjects' => $completedProjects,
             'queryParams' => $request->query() ?: null,
             'isAdmin' => $isAdmin,
         ]);
     }
     
}
