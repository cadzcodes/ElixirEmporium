<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="icon" href="../images/logo.png" type="image/svg+xml">
    <title>Cocktails - Elixir Emporium</title>
    @vite(['resources/css/app.css', 'resources/views/Commerce.jsx'])
</head>

<body>
    <div id="commerce"></div>
</body>
<script>
    window.__USER__ = @json(Auth::user());
</script>

</html>