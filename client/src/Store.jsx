import { createContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

export const Store = createContext();

export const StoreProvider = (props) => {
  const socket = io('http://localhost:5000' || 'http://192.168.1.18:5000');
  const [data, setData] = useState({ user: {} });

  //video call states

  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [call, setCall] = useState();
  const [id, setId] = useState('');
  const userVideoRef = useRef({});
  const remoteVideoRef = useRef({});
  const connectionRef = useRef();

  //end

  // ask the permission for camera and audio settings

  useEffect(() => {
    console.log('INSIDE');
    setId(socket.id);
    navigator.mediaDevices
      ?.getUserMedia({
        video: true,
        audio: true,
      })
      .then((currentStream) => {
        setStream(currentStream);

        userVideoRef.current.src = currentStream;

        console.log('user', userVideoRef);
      });
    socket.on('video:incoming_call', ({ from, to, signal }) => {
      console.log('incoming call', { from, to, signal });
      setCall({ from, name, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on('signal', (signal) => {
      socket.emit('video:answer_call', { signal, to: call.from });
    });
    peer.on('stream', (remoteStream) => {
      remoteVideoRef.current.src = remoteStream;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const makeCall = (id) => {
    console.log('udsds', id);
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on('signal', (signal) => {
      socket.emit('video:incoming_call', { from: socket.id, to: id, signal });
      console.log('call emitted', { from: socket.id, to: id, signal });
    });

    peer.on('stream', (localStream) => (userVideoRef.current = localStream));

    socket.on('video:call_accepted', ({ signal }) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const endCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  useEffect(() => {
    const getUsersData = async () => {
      try {
        const response = await fetch('http://geoplugin.net/json.gp');
        const result = await response.json();
        socket.emit('new_active_user', {
          ip: result.geoplugin_request || 'unknown',
          state: result.geoplugin_region || 'unknown',
          city: result.geoplugin_city || 'unknown',
          country: result.geoplugin_countryName || 'unknown',
          country_code: result.geoplugin_countryCode || 'unknown',
        });

        if (!response.ok) {
          throw new Error('Failed to Fetch Users Location');
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getUsersData();
  }, []);

  return (
    <Store.Provider
      value={{
        socket,
        data,
        setData,
        id,
        call,
        callAccepted,
        callEnded,
        stream,
        userVideoRef,
        remoteVideoRef,
        makeCall,
        answerCall,
        endCall,
      }}
    >
      {props.children}
    </Store.Provider>
  );
};

export default Store;
