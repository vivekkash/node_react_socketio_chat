import { useContext, useEffect, useState } from 'react';
import Store from '../../Store';

const Chatbox = ({ user }) => {
  const socket = useContext(Store);
  const [message, setMessage] = useState('');
  const [data, setData] = useState('');
  const [typing, setTyping] = useState('');

  const messageSubmitHandler = (e) => {
    e.preventDefault();
    socket.emit('in_message', {
      room: user.room,
      name: user.username,
      message,
    });
    setMessage('');
  };

  useEffect(() => {
    // user join join_message
    socket.emit('join_room', { name: user.username, room: user.room });

    socket.on('join_message', ({ message }) => {
      updateMessageHandler('', message);
    });

    // user welcom welcome_user
    socket.on('welcome_user', ({ message }) =>
      updateMessageHandler('', message)
    );

    //typing typing_message
    socket.on('typing_message', ({ message }) => {
      setTyping(message);
    });

    // user message in_message out_message
    socket.on('out_message', ({ name, message }) =>
      updateMessageHandler(name, message)
    );

    // user left left_room
    socket.on('left_room', ({ message }) => updateMessageHandler('', message));

    return () => {
      socket.off();
    };
  }, [socket, user]);

  const typingHandler = (e) => {
    const k = e.keyCode;

    if (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    ) {
      socket.emit('typing', { name: user.username, room: user.room });

      setTimeout(() => socket.emit('stop_typing', { room: user.room }), 1000);
    }
  };
  const leaveHandler = (e) => {
    e.preventDefault();
    socket.emit('left', { room: user.room, name: user.username });
  };

  const updateMessageHandler = (user, message) => {
    setData(message);
    const messageBox = document.getElementById('messageBox');
    const wrapper = document.createElement('p');
    wrapper.innerText = user ? `${user} : ${message}` : message;
    messageBox.appendChild(wrapper);
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
      <div className="w-full md:w-1/3 bg-white h-full rounded-lg shadow-lg">
        <div className="border-2 m-2 p-2 h-4/5 overflow-y-scroll">
          {' '}
          <p>{typing}</p>
          <div id="messageBox">
            {data.message && data.message.map((m, i) => <p key={i}>{m}</p>)}
          </div>
        </div>
        <div className="border-2 m-2 h-24">
          <form onSubmit={messageSubmitHandler} className="flex items-center">
            <textarea
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 h-14 border-[1px] border-gray-300"
              onKeyDown={typingHandler}
            />
            <button className="h-14 p-2 w-20 bg-gray-300">Send</button>
          </form>
          <button className="h-14 p-2 w-20 bg-gray-300" onClick={leaveHandler}>
            leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
