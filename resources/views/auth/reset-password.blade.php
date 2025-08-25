<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="icon" href="../images/logo.png" type="image/svg+xml">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Reset Password - Elixir Emporium</title>
    @vite(['resources/css/app.css', 'resources/views/react-pages/ResetPassword.jsx'])
</head>

<body>
    <div id="resetpass"></div>
</body>
<script>
    window.__USER__ = @json(Auth::check() ? Auth::user() : null);
</script>

</html>