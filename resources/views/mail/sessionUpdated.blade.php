<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Session Updated</title>
</head>

<body>
    <p>Hello {{ $user->name }},</p>

    <p>The session for the project <strong>"{{ $project->name }}"</strong> has been updated.</p>

    <p>Updated Session Details:</p>
    <ul>
        <li><strong>Start Date:</strong> {{ $session->start_date }}</li>
        <li><strong>End Date:</strong> {{ $session->end_date }}</li>
        <li><strong>Number of Assigned Questions:</strong> {{ $session->number_of_questions }}</li>
    </ul>

    <p>Please review the session details and ensure that you are up to date with the latest changes.</p>

    <p><a href="{{ route('project.show', $project->id) }}">View Project</a></p>

    <p>Regards,<br>{{ config('app.name') }}</p>
</body>

</html>