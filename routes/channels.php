<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/
// Dynamic Presence Channel for Streaming
Broadcast::channel('streaming-channel.{streamId}', function ($user) {
    return ['id' => $user->id, 'name' => $user->name];
});

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// $user in the parameter is for authenticated $users in the application because t using private channels
//the second premeter $userId is data pass from the event private channel
// stream-signal-channel.{userId}: stream-signal-channel is the name of the channel
// and {userId} is a placeholder for the data been passed from the event private channel
Broadcast::channel('stream-signal-channel.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
