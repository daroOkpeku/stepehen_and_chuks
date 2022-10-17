<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class show implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
     public $data;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        // PrivateChannel only allows authenticated users to pass data
        // presence only allows authenticated users and un-authenticated users
        // while channnel allows any one to pass data
        // return new PrivateChannel('channel-name');
        return new Channel('Notificate-channel');
    }
}
