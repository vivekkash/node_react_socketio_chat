import { useContext, useEffect, useState } from 'react';
import Store from '../../Store';

const Section = () => {
  const [id, setID] = useState('');
  const {
    socket,
    data: { user },
    id: socketID,
    stream,
    call,
    callAccepted,
    callEnded,
    userVideoRef,
    remoteVideoRef,
    answerCall,
    makeCall,
    endCall,
  } = useContext(Store);

  console.log(userVideoRef);

  useEffect(() => {
    const loadUserVideoStream = () => {
      const userPlayerBox = document.getElementById('userPlayerBox');
      const userVideo = document.createElement('video');
      userVideo.srcObject = userVideoRef.current.src;
      userVideo.autoplay = true;
      userVideo.playsInline = true;
      userVideo.controls = false;
      userVideo.muted = true;

      userVideoRef && userPlayerBox.appendChild(userVideo);
    };
    loadUserVideoStream();
  }, [userVideoRef.current.src]);

  useEffect(() => {
    const remoteUserPlayerBox = document.getElementById('remoteUserPlayerBox');
    const remoteUserVideo = document.createElement('video');
    remoteUserVideo.srcObject = remoteVideoRef.current.src;
    remoteUserVideo.autoplay = true;
    remoteUserVideo.playsInline = true;
    remoteUserVideo.controls = false;

    remoteVideoRef && remoteUserPlayerBox.appendChild(remoteUserVideo);
  }, [callAccepted]);

  return (
    <div className="relative mt-20">
      <h1>video call : id = {user.id}</h1>
      <div>
        <h1>your video</h1>
        <div id="userPlayerBox" className="w-1/2"></div>
      </div>
      <div>
        <h1>remote video</h1>
        <div id="remoteUserPlayerBox" className="w-1/2"></div>
      </div>
      {callAccepted && !callEnded && (
        <>
          <p>From: {call && call.from}</p>
        </>
      )}
      <input type="text" value={id} onChange={(e) => setID(e.target.value)} />

      <button
        onClick={() => makeCall(id)}
        className="h-10 w-20 mr-1 text-white bg-blue-500"
      >
        Call{' '}
      </button>
      <button
        onClick={answerCall}
        className="h-10 w-20 mr-1 text-white bg-blue-500"
      >
        {' '}
        Ans call
      </button>
      <button
        onClick={endCall}
        className="h-10 w-20 mr-1 text-white bg-blue-500"
      >
        {' '}
        End call
      </button>
    </div>
  );
};

export default Section;
