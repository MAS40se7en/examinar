<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Project Admin</title>
</head>

<body>
    <p>Hi {{$admin->name }},</p>
    <p>You have been assigned as the Project Admin for the project <strong>"{{$project->name}}"</strong>.</p>
    <p>You can view and manage the project by clicking the link below</p>
    <p>
        <a href="{{route('project.show', $project->id)}}">View Project</a>
    </p>
    <br>
    <br>
    <p>Regards,<br>DataLabeler</p>
</body>

</html>