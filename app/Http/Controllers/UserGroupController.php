<?php

namespace App\Http\Controllers;

use App\Models\UserGroup;
use App\Http\Requests\StoreUserGroupRequest;
use App\Http\Requests\UpdateUserGroupRequest;
use App\Http\Resources\UserGroupResource;
use App\Http\Resources\UserResource;
use App\Models\Answers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $currentUser = auth()->user();

    // Check if the current user is authorized
    $isSystemAdmin = $currentUser->role === 'admin';
    
    if (!$isSystemAdmin) {
        return redirect()->route('error.page', ['prvs' => url()->previous()]);
    }

    $searchGroups = $request->input('search_groups');
    $sortField = $request->input('sort_field', 'id');
    $sortDirection = $request->input('sort_direction', 'asc');

    $users = User::where('id', '!=', $currentUser->id)
        ->whereNotNull('email_verified_at')
        ->get();

    $userGroups = UserGroup::when($searchGroups, function ($query, $searchGroups) {
        $query->where('name', 'like', "%{$searchGroups}%");
    })
    ->orderBy($sortField, $sortDirection)
    ->get();

    return inertia('UserGroup/Index', [
        'userGroups' => $userGroups,
        'users' => UserResource::collection($users),
        'success' => session('success'),
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
    public function store(StoreUserGroupRequest $request)
    {
        $validated = $request->validated();

        $currentUser = auth()->user();

    // Check if the current user is authorized
    $isSystemAdmin = $currentUser->role === 'admin';
    
    if (!$isSystemAdmin) {
        return redirect()->route('error.page', ['prvs' => url()->previous()]);
    }

        $userGroup = UserGroup::create([
            'name' => $validated['name'],
            'created_by' => Auth::id(),
            'users' => $validated['users'],
        ]);

        return to_route('groups.index')->with('success', 'User Group Created Successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(UserGroup $userGroup)
    {

    }



    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserGroup $userGroup)
    {
        $currentUser = auth()->user();

        if (!$userGroup) {
            return redirect()->back()->with('error', 'group not found');
        }

    // Check if the current user is authorized
    $isSystemAdmin = $currentUser->role === 'admin';
    
    if (!$isSystemAdmin) {
        return redirect()->back()->with('error', 'You do not have permission to access this function.');
    }
        return inertia("UserGroup/Edit", [
            'userGroup' => $userGroup,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

public function update(UpdateUserGroupRequest $request, UserGroup $group)
{
    $currentUser = auth()->user();

    if (!$group) {
        return redirect()->back()->with('error', 'group not found');
    }

    // Check if the current user is authorized
    $isSystemAdmin = $currentUser->role === 'admin';
    
    if (!$isSystemAdmin) {
        return redirect()->route('error.page', ['prvs' => url()->previous()]);
    }

    $validated = $request->validated();
    $id = $group->id;

    $originalUsers = $group->users;
    $group->name = $validated['name'];
    $group->users = $validated['users'];
    $group->save();

    $newUsers = $validated['users'] ?? [];
    $removedUsers = array_diff($originalUsers, $newUsers);
    $addedUsers = array_diff($newUsers, $originalUsers);

    // Get all projects that use this user group
    $projects = $group->projects;

    foreach ($removedUsers as $removedUserId) {
        Log::info("Removing user with ID: $removedUserId");
        foreach ($projects as $project) {
            foreach ($project->sessions as $session) {
                $session->reassignQuestionsOnUserRemoval($removedUserId);
            }
        }
    }

    foreach($addedUsers as $addedUserId) {
        Log::info("Adding user with ID: $addedUserId");
        foreach ($projects as $project) {
            foreach ($project->sessions as $session) {
                $session->assignQuestionsToNewUser($addedUserId);
            }
        }
    }

    return to_route('groups.index')->with('success', "User Group \"{$id}\" Updated Successfully!");
}





    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserGroup $group)
    {
        $currentUser = auth()->user();

        if (!$group) {
            return redirect()->back()->with('error', 'group not found');
        }

    // Check if the current user is authorized
    $isSystemAdmin = $currentUser->role === 'admin';
    
    if (!$isSystemAdmin) {
        return redirect()->route('error.page', ['prvs' => url()->previous()]);
    }

        $name = $group->name;
        $group->delete();

        return to_route('groups.index')->with('success', "User Group \"{$name}\" Deleted Successfully!");
    }

}
