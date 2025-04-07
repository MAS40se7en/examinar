<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>System Admin</title>
</head>

<body>
    <p>Dear {{$user->name}},</p>
    <h1>You are now a System Admin</h1>
    <p>We would like to inform you that your role has been changed to <strong>{{ $newRole }}</strong>.</p>
    <p>If you have any questions or concerns about this change, please contact our support team.</p>
    <p>Thank you!</p>
    <br>
    <br>
    <p>Regards,<br>DataLabeler</p>
</body>

</html>