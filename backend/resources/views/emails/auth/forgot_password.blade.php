<!DOCTYPE html>
<html>
<head>
    <title>Forgot Password</title>
</head>
<body>
Hi {{ $user->name }}, <br><br>

This is your reset link : <a href={{ $reset_link}} target="_blank">{{ $reset_link }}
</body>
</html>