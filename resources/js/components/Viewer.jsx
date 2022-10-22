import React,{useEffect, useRef, useState} from 'react'
import ReactDOM from 'react-dom';
import axios from 'axios'
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export default function Viewer() {
    // console.log(type, streamId, id)
    const [broadcasterId, setBroadcasterId] = useState(null)
    const vidRef=useRef();
    window.Pusher = Pusher;
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        wsHost: import.meta.env.VITE_PUSHER_HOST ?? `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
        wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
        wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        cluster:import.meta.env.VITE_PUSHER_APP_CLUSTER
    });

    const handleViewer =()=>{
        initializeStreamingChannel()
        // initializeSignalOfferChannel()
    }

    function initializeStreamingChannel(){
       let streamingPresenceChannel = window.Echo.join(`streaming-channel.${streamId}`);
       window.Echo.private(`stream-signal-channel.${id}`).listen("StreamOffer",
       ( data ) => {
           console.log(data)
           console.log("Signal Offer from private channel");
           setBroadcasterId(data.broadcaster);
           createViewerPeer(data.offer, data.broadcaster);
         }
       )
    }


    // function initializeSignalOfferChannel(){
    //     window.Echo.private(`stream-signal-channel.${id}`).listen("App\\Events\\StreamOffer",
    //     ({ data }) => {
    //         console.log(data)
    //         console.log("Signal Offer from private channel");
    //         setBroadcasterId(data.broadcaster);
    //         createViewerPeer(data.offer, data.broadcaster);
    //       }
    //     )
    // }



    function createViewerPeer(offer, broadcaster){
           let peer = new Peer({
            initiator: false,
            trickle: false,
            config: {
              iceServers: [
                {
                  urls: "stun:stun.stunprotocol.org",
                },
                // {
                //   urls: this.turn_url,
                //   username: this.turn_username,
                //   credential: this.turn_credential,
                // },
              ],
            },
           });

           peer.addTransceiver("video", { direction: "recvonly" });
           peer.addTransceiver("audio", { direction: "recvonly" });
           handlePeerEvents(peer, offer, broadcaster)
    }

    function handlePeerEvents(peer, offer, broadcaster){
        peer.on("signal", (data) => {
            let formData = new FormData();
            formData.append("broadcaster",  broadcaster)
            formData.append("answer", data)
            // formData.append('auth', id)
            axios.post("http://127.0.0.1:8000/stream-answer", formData)
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          });


          peer.on("stream", (stream) => {
            console.log(stream)
            // display remote stream
            // try{
                vidRef.current.srcObject = stream
            // }catch(err){
            //     vidRef.current.src = URL.createObjectURL(stream)
            //       }
          });


          peer.on("track", (track, stream) => {
            console.log("onTrack");
          });

          peer.on("connect", () => {
            console.log("Viewer Peer connected");
          });


          peer.on("close", () => {
            console.log("Viewer Peer closed");
            peer.destroy();
            cleanupCallback();
          });


          const updatedOffer = {
            ...offer,
            sdp: `${offer.sdp}\n`,
          };

          peer.signal(updatedOffer);
    }






    function cleanupCallback (){
        console.log("removingBroadcast Video");
        alert("Livestream ended by broadcaster");
        const tracks = vidRef.current.srcObject.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        try{
            vidRef.current.srcObject = null
        }catch(err){
            vidRef.current.src = null
          }
    }








    return (
        <div>

            Viewer
            <video style={{width:'500px', height:'420px' }}   autoPlay={true} ref={vidRef} >
            </video>
           <button onClick={handleViewer}>join stream</button>
        </div>
    )
}

if (document.getElementById('view')) {
    ReactDOM.render(<Viewer/>, document.getElementById('view'));
}
