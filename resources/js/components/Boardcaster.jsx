import React, {useEffect, useState, useRef} from 'react';
import MediaHandler from './MediaHandler';
import Pusher from 'pusher-js';
import ReactDOM from 'react-dom';
import axios from 'axios'
import Echo from 'laravel-echo';
// import Peer from 'simple-peer';
export default function Boardcaster() {
    const [videourl, setVideourl] = useState('')
    const [isvideo, setisVideo]  = useState(false)
    const [playvideo, setPlayvideo] = useState(false)
    const [peers, setPeers] = useState(undefined)
    const [otherUserId, SetotherUserId] = useState(null)
    const [streamdata, setStreamdata] = useState(null)
    const [streamUsers, setStreamusers] = useState([])
    const vidRef=useRef();

    useEffect(()=>{

   let  media = new MediaHandler();
        media.getPermissions().then((stream)=>{
            setStreamdata(stream)
               try{
        vidRef.current.srcObject = stream
    }catch(err){
        vidRef.current.src = URL.createObjectURL(stream)
          }
        }).catch((error)=>{

        });

        // vidRef.current.play()
// async function show(){
//  let stream =  await  navigator.mediaDevices.getUserMedia({video:true, audio:true})
//     console.log(stream)
//      try{
//         // setVideourl(stream)
//         vidRef.current.srcObject = stream
//     }catch(err){
//         vidRef.current.src = URL.createObjectURL(stream)
//     //    setVideourl(convert)

//     }
//     // setPlayvideo(true)
//


// let answer = await media.getpermissions()
// console.log(URL.createObjectURL(answer));


// }

// show();

    },[])

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

   const handleclick =()=>{
    let  media = new MediaHandler();
    media.getPermissions().then((stream)=>{
        setStreamdata(stream)
           try{
    vidRef.current.srcObject = stream
    initializeStreamingChannel()
    initializeSignalAnswerChannel()
}catch(err){

}
    }).catch(err=>console.log(err))

//     Pusher.logToConsole = true;


//     let pusher = new Pusher('f959c4bf7c6b75daca59', {
//        authEndpoint: 'authenticated',
//        cluster: 'eu',
//        auth: {
//            params: userid,
//            headers: {
//                'X-CSRF-Token': token
//            }
//        }
//    });

//      var channel = pusher.subscribe('presence-auth');
//      channel.bind('client-signal-'+userid, function(data) {
//       console.log(data.userId)
//       setPeers(data.userId);
//         if(peers === undefined) {
//             SetotherUserId(data.userId)
//             startPeer(data.userId, false, channel)
//         }

//         // SetotherUserId
//      });
//    }

//    function startPeer (userId, initiator = true, channel){
//     const peerx = new Peer({
//         initiator,
//         stream:streamdata,
//         trickle:false,
//     })
// // this
//     peerx.on('signal', function(data){
//         channel.trigger('client-signal-'+userId, {
//             type: 'signal',
//             userId: userid,
//             data: data
//         });
//     })

//     peerx.on('stream', (stream)=>{
//         try{
//             vidRef.current.srcObject = stream
//         }catch(err){
//             vidRef.current.src = URL.createObjectURL(stream)
//             }
//             vidRef.current.play()

//     })

   }



   function initializeStreamingChannel (){
    let streamingPresenceChannel  =  window.Echo.join(
        `streaming-channel.${userid}`
    );
    // 1ryrdhjd
    streamingPresenceChannel.here((user)=>{
        console.log(user)
        setStreamusers(user)
        //         setStreamusers([...streamUsers,user])
    });

    streamingPresenceChannel.joining((user)=>{
        console.log("New User", user);
      let joiningUserIndex =  streamUsers.findIndex((data) => data.id === user.id)

      if(joiningUserIndex  < 0){
      setStreamusers([...streamUsers,user])
      SetotherUserId(user.id)

      peerCreator(vidRef.current.srcObject, user)
      }
    })

    this.streamingPresenceChannel.leaving((user) => {
        console.log(user.name, "Left");
        // destroy peer
        this.allPeers[user.id].getPeer().destroy();

        // delete peer object
        delete this.allPeers[user.id];
        let streamingUsers;
        // if one leaving is the broadcaster set streamingUsers to empty array
        if (user.id === userid) {
          streamingUsers = [];
        } else {
          // remove from streamingUsers array
          const leavingUserIndex = streamingUsers.findIndex(
            (data) => data.id === user.id
          );
          streamingUsers.splice(leavingUserIndex, 1);
        }
      });


   }


  function peerCreator (stream, user){

    let peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
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

      peer.on("signal", (data) => {
        // send offer over here.
        signalCallback(data, user);
      });

      peer.on("stream", (stream) => {
        console.log("onStream");
      });

      peer.on("track", (track, stream) => {
        console.log("onTrack");
      });

      peer.on("connect", () => {
        console.log("Broadcaster Peer connected");
      });

      peer.on("close", () => {
        console.log("Broadcaster Peer closed");
      });

      peer.on("error", (err) => {
        console.log("handle error gracefully");
      });

  }

 function signalCallback (offer, user) {
    axios.post("http://127.0.0.1:8000/stream-offer", {
        broadcaster:userid,
        receiver: user,
        offer,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }


  function initializeSignalAnswerChannel (){
    window.Echo.private(`stream-signal-channel.${userid}`).listen( "StreamAnswer",
    ({ data }) => {
        console.log("Signal Answer from private channel");

        if (data.answer.renegotiate) {
          console.log("renegotating");
        }
        if (data.answer.sdp) {
          const updatedSignal = {
            ...data.answer,
            sdp: `${data.answer.sdp}\n`,
          };

        //  allPeers[this.currentlyContactedUser]
        //     .getPeer()
        //     .signal(updatedSignal);
        }
      }

    )
  }


    return (
        <div >
            video here
         <video style={{width:'500px', height:'420px' }}   autoPlay={true} ref={vidRef} >
            </video>
            <button onClick={handleclick}>click here</button>
        </div>
    )
}
if (document.getElementById('board')) {
    ReactDOM.render(<Boardcaster/>, document.getElementById('board'));
}
