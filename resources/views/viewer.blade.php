<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/components/Viewer.jsx'])

</head>
<body>
<div id="view"></div>
</body>
<script src="https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js"></script>
<script>
    var type = {{ Js::from($type??"") }}
    var streamId = {{ Js::from($streamId??"")}}
    var id = {{ Js::from($id??"") }}
</script>
</html>
