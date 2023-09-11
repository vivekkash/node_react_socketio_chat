import { useContext, useEffect, useState } from 'react';
import Store from '../../Store';
import { useNavigate } from 'react-router-dom';
import { FaRegMessage } from 'react-icons/fa6';

const User = () => {
  const [room, setRoom] = useState('default');
  const [roomList, setRoomList] = useState([]);
  const [username, setUsername] = useState('');
  const { socket, setData } = useContext(Store);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit('fetch-rooms', {});
    socket.on('room-list', (rooms) => {
      setRoomList(rooms);
    });
  }, [socket]);

  const chatSettingHandler = (e) => {
    e.preventDefault();
    if (username.trim() != '' && room !== 'default') {
      setData({ user: { room, username } });
      navigate('/room');
    }
  };

  return (
    <div className="relative mt-20">
      <div className="flex justify-center h-[calc(100vh-10rem)] px-2">
        <div className="flex flex-wrap justify-around w-full md:w-3/4 shadow-md">
          <div className="hidden md:block bg-blue-600 flex-1 text-white items-center">
            <div className="h-full flex flex-col justify-center items-center gap-2">
              <FaRegMessage className="text-5xl" />
              <p className=" text-5xl font-semibold">Gups</p>
            </div>
          </div>
          <div className="bg-zinc-100 flex-1">
            <div className="flex flex-col items-center justify-center w-full h-full gap-3">
              <div className="md:hidden">
                <span className="inline-block text-5xl text-gray-300">
                  <FaRegMessage />
                </span>{' '}
              </div>
              <select
                name="room"
                onChange={(e) => setRoom(e.target.value)}
                value={room}
                className="text-black w-3/4 h-10 border-[1px] border-gray-200 p-1 outline-none text-sm"
              >
                <option disabled value="default">
                  Choose Room
                </option>
                {roomList.length > 0 &&
                  roomList.map((r, i) => (
                    <option key={i} className="mx-2">
                      {r}{' '}
                    </option>
                  ))}
              </select>
              <input
                type="text"
                id="username"
                className="text-black w-3/4 h-10 border-[1px] border-gray-200 px-2 outline-none text-sm"
                placeholder="Enter the username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <p className="text-right m-2">
                <button
                  className="w-16 h-10 px-4 text-sm bg-blue-600 text-white"
                  onClick={chatSettingHandler}
                >
                  Enter
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
