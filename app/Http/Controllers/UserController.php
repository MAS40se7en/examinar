<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\ProjectResource;
use App\Mail\RoleChangedNotification;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Models\Project;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $currentUser = auth()->user();

    // Check if the current user is an admin
    if ($currentUser->role !== 'admin') {
        return redirect()->back()->with('error', 'You do not have permission to access this function.');
    }

    $search = $request->input('search');
    $sortBy = $request->input('sort_by', 'name');
    $sortDirection = $request->input('sort_direction', 'desc');

    $users = User::where('id', '!=', $currentUser->id)
        ->whereNotNull('email_verified_at')
        ->when($search, function ($query) use ($search, $currentUser) {
            $query->where(function ($subQuery) use ($search, $currentUser) {
                $subQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->where('id', '!=', $currentUser->id);
        })
        ->orderBy($sortBy, $sortDirection)
        ->get();

    return inertia('Users/Index', [
        'users' => UserResource::collection($users),
        'success' => session('success'),
        'queryParams' => $request->query() ?: null,
    ]);
}




    public function showProjects(Request $request)
    {
        $user = Auth::user();

        $projects = DB::table('projects')->where('created_by', $user->id)->orderBy('start_date', 'asc')->get();

        return view('user.projects', [
            'projects' => ProjectResource::collection($projects)
        ]);
    }




    public function userSearch($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        return response()->json($user);
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
    public function store(StoreUserRequest $request)
    {
        //
    }
    public function show(User $user)
    {
        $currentUser = auth()->user();

    // Check if the current user is an admin
    if ($currentUser->role !== 'admin') {
        return redirect()->route('error.page', ['prvs' => url()->previous()]);
    }
        // Fetch the user's projects where they are a project admin
        $adminProjects = Project::whereJsonContains('project_admin', $user->id)
            ->with('userGroup')
            ->get();

        // Fetch the user's projects where they are a participant
        $participantProjects = Project::whereHas('userGroup', function ($query) use ($user) {
            $query->whereJsonContains('users', $user->id);
        })
            ->with('userGroup')
            ->get();

        foreach ($adminProjects as $project) {
            $project->project_admins = $project->project_admin
                ? User::whereIn('id', $project->project_admin)->get()
                : collect();
        }

        foreach ($participantProjects as $project) {
            $project->project_admins = $project->project_admin
                ? User::whereIn('id', $project->project_admin)->get()
                : collect();
        }

        return inertia('Users/Show', [
            'user' => $user,
            'adminProjects' => $adminProjects,
            'participantProjects' => $participantProjects,
        ]);
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $currentUser = auth()->user();

    // Check if the current user is an admin
    if ($currentUser->role !== 'admin') {
        return redirect()->route('error.page', ['prvs' => url()->previous()]);
    }
        $data = $request->validated();
        $oldRole = $user->role;
        $newRole = $data['role'];

        $user->update($data);

        if ($oldRole !== $newRole) {
            Mail::to($user->email)->send(new RoleChangedNotification($user, $newRole));
        }
        return to_route('user.index')
            ->with('success', "User  \"$user->name\" role was updated");
    }

    /**
     * Update password of a user
     */
    public function updatePassword(UpdatePasswordRequest $request, User $user)
    {
        $currentUser = auth()->user();

    // Check if the current user is an admin
    if ($currentUser->role !== 'admin') {
        return redirect()->route('error.page', ['prvs' => url()->previous()]);
    }
        $data = $request->validated();
        if (!empty($data['password'])) {
            $user->update([
                'password' => Hash::make($data['password'])
            ]);
        }
        return to_route('user.index')
            ->with('success', "User  \"$user->name\" password was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $currentUser = auth()->user();

    // Check if the current user is an admin
    if ($currentUser->role !== 'admin') {
        return redirect()->route('error.page', ['prvs' => url()->previous()]);
    }
        // Remove user reference from projects
        Project::where('project_admin', $user->id)->update(['project_admin' => null]);

        $name = $user->name;
        $user->delete();

        return to_route('user.index')->with('success', "User \"$name\" Deleted Successfully");
    }
}
