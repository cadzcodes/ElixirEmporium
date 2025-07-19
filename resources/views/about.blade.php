<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="icon" href="../images/logo.png" type="image/svg+xml">
    <title>About - Elixir Emporium</title>
    @vite(['resources/css/app.css', 'resources/views/AboutCompile.jsx'])
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>

<body>
    <div id="aboutCompile"></div>
</body>
<script>
    window.__USER__ = @json(Auth::user());
</script>

</html>