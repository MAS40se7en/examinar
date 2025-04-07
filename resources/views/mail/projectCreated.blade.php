<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Project Created</title>
</head>

<body>
    <p>Hello {{ $user->name }},</p>

    <p>A project titled <strong>{{ $project->name }}</strong> has been created and assigned to the
        <strong>{{ $userGroup->name }}</strong> group, of which you are a member.
    </p>

    <p>Click the link below to view the project's details:</p>

    <p><a href="{{ route('project.show', $project->id) }}">View Project</a></p>

    <p>Regards,<br>{{ config('app.name') }}</p>
</body>

</html>