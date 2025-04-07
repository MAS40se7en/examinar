<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Project Created</title>
</head>

<body>
    <p>Hello {{ $user->name }},</p>

    <p>A new session has been created for the project <strong>"{{ $project->name }}"</strong>.</p>

    <p>Session Details:</p>
    <ul>
        <li><strong>Start Date:</strong> {{ $session->start_date }}</li>
        <li><strong>End Date:</strong> {{ $session->end_date }}</li>
        <li><strong>Number of Assigned Questions:</strong> {{ $session->number_of_questions }}</li>
    </ul>

    <p><a href="{{ route('project.show', $project->id) }}">View Project</a></p>

    <p>Regards,<br>{{ config('app.name') }}</p>
</body>

</html>