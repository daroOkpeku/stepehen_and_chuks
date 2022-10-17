import React, {useEffect, useState, useRef} from 'react';
import MediaHandler from './MediaHandler';
import Pusher from 'pusher-js';
import ReactDOM from 'react-dom';
// import Peer from 'simple-peer';
export default function Boardcaster() {
    const [videourl, setVideourl] = useState('')
    const [isvideo, setisVideo]  = useState(false)
    const [playvideo, setPlayvideo] = useState(false)
    const [peers, setPeers] = useState(undefined)
    const [otherUserId, SetotherUserId] = useState(null)
    const [streamdata, setStreamdata] = useState(null)
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

   const handleclick =()=>{
    Pusher.logToConsole = true;


    let pusher = new Pusher('f959c4bf7c6b75daca59', {
       authEndpoint: 'authenticated',
       cluster: 'eu',
       auth: {
           params: userid,
           headers: {
               'X-CSRF-Token': token
           }
       }
   });

     var channel = pusher.subscribe('presence-auth');
     channel.bind('client-signal-'+userid, function(data) {
      console.log(data.userId)
      setPeers(data.userId);
        if(peers === undefined) {
            SetotherUserId(data.userId)
            startPeer(data.userId, false, channel)
        }

        // SetotherUserId
     });
   }

   function startPeer (userId, initiator = true, channel){
    const peerx = new Peer({
        initiator,
        stream:streamdata,
        trickle:false,
    })
// this
    peerx.on('signal', function(data){
        channel.trigger('client-signal-'+userId, {
            type: 'signal',
            userId: userid,
            data: data
        });
    })

    peerx.on('stream', (stream)=>{
        try{
            vidRef.current.srcObject = stream
        }catch(err){
            vidRef.current.src = URL.createObjectURL(stream)
            }
            vidRef.current.play()

    })

   }

    return (
        <div >
            video here
         <video style={{width:'300px', height:'320px' }}   autoPlay={true} ref={vidRef} >
            </video>
            <button onClick={handleclick}>click here</button>
        </div>
    )
}
if (document.getElementById('board')) {
    ReactDOM.render(<Boardcaster/>, document.getElementById('board'));
}
