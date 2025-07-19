<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="icon" href="../images/logo.png" type="image/svg+xml">
    <title>Elixir Emporium</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @vite(['resources/css/app.css', 'resources/views/App.jsx'])
</head>

<body>
    <div id="app"></div>
</body>

<script>
    window.__USER__ = @json(Auth::user());
</script>

</html>