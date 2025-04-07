<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Project Admin Removed</title>
</head>

<body>
    <p>Hello {{ $admin->name }},</p>
    <p>You are no longer the admin for the project "{{ $project->name }}".</p>
    <br>
    <br>
    <p>Best regards,<br>Data Labeler</p>
</body>

</html>