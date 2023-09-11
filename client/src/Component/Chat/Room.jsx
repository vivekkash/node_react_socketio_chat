import { useCallback, useContext, useEffect, useState } from 'react';
import Store from '../../Store';
import { useNavigate } from 'react-router-dom';
import UsersList from './UsersList';
import { FaPaperPlane, FaFaceSmile } from 'react-icons/fa6';
import Messages from './Messages';
import 'unicode-emoji-picker';

const Chatbox = () => {
  const {
    socket,
    data: { user },
  } = useContext(Store);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState('');
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!(user.username && user.room)) {
      navigate('/join');
    }
  }, [user, navigate]);

  const messageSubmitHandler = (e) => {
    e.preventDefault();
    const message = document.getElementById('message');
    if (message.value.trim() === '') {
      return;
    }

    socket.emit('out_message', {
      room: user.room,
      name: user.username,
      message: message.value,
    });

    message.value = '';
    toggle == true && setToggle(!toggle);
  };

  const joinRoomMessageHandler = useCallback(
    ({ name, message, type }) => {
      setMessages([...messages, { message, name, type }]);
    },
    [messages]
  );

  const welcomeUserHandler = useCallback(
    ({ name, message, type }) => {
      setMessages([...messages, { message, name, type }]);
    },
    [messages]
  );

  const typingMessageHandler = useCallback(({ message }) => {
    setTyping(message);
  }, []);

  const incomingMessageHandler = useCallback(
    ({ name, message, id }) => {
      setMessages([...messages, { message, name, id }]);
    },
    [messages]
  );

  const userLeftRoomHandler = useCallback(
    ({ name, message, type }) => {
      setMessages([...messages, { message, name, type }]);
    },
    [messages]
  );

  const userDisconnectedHandler = useCallback(
    ({ name, message, type }) => {
      setMessages([...messages, { message, name, type }]);
    },
    [messages]
  );

  useEffect(() => {
    socket.emit('join_room', { name: user.username, room: user.room });
    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on('join_message', joinRoomMessageHandler);

    socket.on('welcome_user', welcomeUserHandler);

    return () => {
      socket.off('join_message', joinRoomMessageHandler);

      socket.off('welcome_user', welcomeUserHandler);
    };
  });

  useEffect(() => {
    socket.on('left_room', userLeftRoomHandler);

    socket.on('disconnected', userDisconnectedHandler);

    return () => {
      socket.off('left_room', userLeftRoomHandler);

      socket.off('disconnected', userDisconnectedHandler);
    };
  });

  useEffect(() => {
    socket.on('typing_message', typingMessageHandler);
    return () => {
      socket.off('typing_message', typingMessageHandler);
    };
  }, []);

  // keeping messsage event separate or other events will refresh the messages state.
  useEffect(() => {
    socket.on('in_message', incomingMessageHandler);
    return () => {
      socket.off('in_message', incomingMessageHandler);
    };
  }, [messages]);

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
    localStorage.removeItem('user');
    socket.emit('left', { room: user.room, name: user.username });
    navigate('/join');
  };

  const autoScrollMessage = () => {
    var elem = document.getElementById('MessageBox');
    elem.scrollTop = elem.scrollHeight;
  };

  useEffect(() => {
    autoScrollMessage();
  }, [messages]);

  useEffect(() => {
    let message = document.getElementById('message');
    const emojiPicker = document.querySelector('unicode-emoji-picker');

    emojiPicker.addEventListener('emoji-pick', (event) => {
      addEmojitoMessage(message, event);
    });

    return () => {
      document.removeEventListener('emoji-pick', addEmojitoMessage);
    };
  }, []);

  const emojiPickerHandler = (e) => {
    e.preventDefault();
    setToggle(!toggle);
  };

  const addEmojitoMessage = (message, event) => {
    message.value = message.value + event.detail.emoji;
  };

  return (
    <div className="relative mt-20">
      <div className="flex justify-center items-center h-[calc(100vh-5rem)] md:h-[calc(100vh-10rem)]">
        <div className="w-60 h-full bg-blue-500 rounded-md">
          <UsersList room={user.room} />
        </div>
        <div className="relative w-full md:w-1/3 bg-stone-100 h-full rounded-md">
          <div className="h-16 flex justify-between items-center shadow-md">
            <div className="m-2 flex justify-evenly items-center gap-2">
              <div className="h-12 w-12 p-2.5 text-center rounded-full bg-amber-300 text-white text-lg font-semibold">
                {user.username && user?.username[0]}
              </div>
              <div className="text-md font-thin ">
                {user.username && user.username}
              </div>
              <div className="h-3 w-3 bg-green-700 rounded-full"></div>
            </div>
            <div className="mx-2">
              <button
                className="block h-8 w-8 text-center rounded-full bg-gray-300 text-white "
                onClick={leaveHandler}
              >
                x
              </button>
            </div>
          </div>
          <div
            className="relative m-2 p-2 h-3/4 overflow-y-scroll"
            id="MessageBox"
          >
            <Messages messages={messages} id={socket.id} />
            {typing && (
              <div className="absolute text-[14px] bottom-0">
                {' '}
                <p className="bg-white rounded-md p-2 italic">{typing}</p>
              </div>
            )}
          </div>
          <div className="bg-stone-200 bottom-0 absolute w-full px-2 h-14">
            <form className="flex items-center">
              <textarea
                type="text"
                id="message"
                placeholder="Type your message here.."
                className="flex-1 h-14 border-[1px] text-[12px] pt-4 bg-stone-200 resize-none outline-none"
                onKeyDown={typingHandler}
              />
              <button
                className="h-9 w-9 rounded-full bg-blue-500 text-white"
                onClick={emojiPickerHandler}
              >
                <FaFaceSmile className="w-9" />
              </button>
              <button
                className="h-9 w-9 mx-1 rounded-full bg-blue-500 text-white"
                onClick={messageSubmitHandler}
              >
                <FaPaperPlane className="w-9" />
              </button>
            </form>
          </div>
          <div
            className={`relative w-full h-10 ${toggle ? 'block' : 'hidden'}`}
          >
            <unicode-emoji-picker></unicode-emoji-picker>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
