<!DOCTYPE html>
<html>

<head>
    <title>Project Updated</title>
</head>

<body>
    <p>Hello {{ $user->name }},</p>

    <p>The details of this project <strong>"{{ $project->name }}"</strong> has been updated.</p>

    @if($isAdmin)
        <p>As an administrator, you can view and manage the project using the link below:</p>
    @else
        <p>You can view the updated project details by clicking the link below:</p>
    @endif

    <p><a href="{{ route('project.show', $project->id) }}">View Project</a></p>

    <p>Best regards,<br>{{ config('app.name') }}</p>
</body>

</html>