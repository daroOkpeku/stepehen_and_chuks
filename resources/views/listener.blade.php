<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Document</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/components/Example.jsx'])

    {{--  @vite('resources/js/app.jsx')  --}}
</head>
<body>

    <div id="example"></div>
</body>
</html>
