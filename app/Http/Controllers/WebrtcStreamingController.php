<?php

namespace App\Http\Controllers;

use App\Events\StreamOffer;
use App\Events\StreamAnswer;
use Illuminate\Http\Request;
use Pusher\Pusher;
class WebrtcStreamingController extends Controller
{
    public function makeStreamOffer(Request $request)
    {
        // dd($request->all());
        $data['broadcaster'] = $request->broadcaster;
        $data['receiver'] = $request->receiver;
        $data['offer'] = $request->offer;
        event(new StreamOffer($data));
    }


    public function makeStreamAnswer(Request $request)
    {
        $data['broadcaster'] = $request->broadcaster;
        $data['answer'] = $request->answer;

        event(new StreamAnswer($data));
    }

    public function index()
    {
        return view('video-broadcast', ['type' => 'broadcaster', 'id' =>auth()->user()->id]);
    }

    public function consumer(Request $request, $streamId)
    {
        return view('viewer', ['type' => 'consumer', 'streamId' => $streamId, 'id' =>auth()->user()->id]);
    }


    public function authenticated(Request $request)
    {
        $pusher = new Pusher(
            'f959c4bf7c6b75daca59',//app_key
            '93e90cc00e31b1f10f33',//app_secret
            '1491863'//app_id
        );
        $socketid =  $request->socket_id;
        $channelName = $request->channel_name;
        // dd([$socketid, $channelName, auth()->user()]);

        $presence_data = ['name' => auth()->user()->name];
        $key = $pusher->presence_auth($channelName, $socketid, auth()->user()->id, $presence_data);
         return response($key);
    }
}
