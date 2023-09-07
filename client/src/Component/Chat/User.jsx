import { useContext, useEffect, useState } from 'react';
import Store from '../../Store';

const User = ({ setUser }) => {
  const [room, setRoom] = useState('General');
  const [roomList, setRoomList] = useState([]);
  const [username, setUsername] = useState([]);
  const socket = useContext(Store);

  useEffect(() => {
    socket.emit('fetch-rooms', {});
    socket.on('room-list', (rooms) => {
      setRoomList(rooms);
    });
  }, [socket]);

  const chatSettingHandler = () => {
    const user = { username: username, room: room };
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  return (
    <div className="flex justify-center w-full px-2">
      <div className="flex flex-wrap justify-around w-full md:w-3/4 bg-white p-4 shadow-md">
        <div className="">
          <h2 className="text-sm font-bold my-2">List of Channels</h2>
          <div>
            {roomList.length > 0 &&
              roomList.map((r, i) => (
                <div key={i}>
                  <input
                    type="radio"
                    name="room"
                    id={r}
                    checked={room === r}
                    value={r}
                    onChange={(e) => setRoom(e.target.value)}
                    className="mx-2"
                  />
                  <label htmlFor={r} className="text-sm">
                    {r}
                  </label>
                </div>
              ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold my-2">
            Selected Room:{' '}
            <span className="text-[14px] font-light mx-2">{room}</span>
          </h2>
          <label htmlFor="username" className="text-sm font-bold">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="border-[1px] border-gray-400 p-1 text-[14px] mx-2"
            placeholder="Enter the username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p className="text-right m-2">
            <button
              className="w-16 h-10 px-4 text-sm bg-blue-500 text-white"
              onClick={chatSettingHandler}
            >
              Enter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default User;
