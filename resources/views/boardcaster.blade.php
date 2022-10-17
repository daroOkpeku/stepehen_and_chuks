<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Document</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/components/Boardcaster.jsx'])
    @vite('resources/js/Peer.js')
</head>
<body>

    <div id="board"></div>
</body>
{{--  <script src='../'></script>  --}}
<script src="https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js"></script>
<script>
    {{--  var peer = new Peer();
    console.log(peer);  --}}
    var userid =  {{ Js::from(auth()->user()->id) }}
    let token = document.querySelector('meta[name="csrf-token"]').content;


</script>
</html>
