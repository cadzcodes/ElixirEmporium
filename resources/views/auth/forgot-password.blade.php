<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="icon" href="../images/logo.png" type="image/svg+xml">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Login - Elixir Emporium</title>
    @vite(['resources/css/app.css', 'resources/views/react-pages/ForgotPassword.jsx'])
</head>

<body>
    <div id="forgotpass"></div>
</body>
<script>
    window.__USER__ = @json(Auth::check() ? Auth::user() : null);
</script>

</html>