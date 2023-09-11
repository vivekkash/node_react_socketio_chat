import { useContext, useEffect, useState } from 'react';
import Store from '../../Store';

const UsersList = ({ room }) => {
  const { socket } = useContext(Store);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on('room_users_list', (allUsers) => setUsers(allUsers));

    return () => {
      socket.off('room_users');
      socket.off('room_users_list');
    };
  }, [room]);

  console.log(users);

  return (
    <div className="flex flex-col">
      <div className="h-20"></div>
      <div className="text-md font-light overflow-y-auto h-[calc(60vh)]">
        {/* user */}
        {users.length > 0 &&
          users.map((u, i) => {
            return (
              <div
                key={i}
                className="relative sh-10 w-full flex justify-start items-center gap-2 hover:bg-blue-400 py-2 px-3"
              >
                <div className="h-10 w-10 p-2 text-center rounded-full bg-gray-400 text-white text-md font-semibold">
                  {u.name[0]}
                </div>
                <div className="text-sm bg-green-500 h-3 w-3 rounded-full absolute left-8 bottom-2"></div>
                <div className="hidden md:block text-md font-thin">
                  <div className="text-sm text-white font-normal">{u.name}</div>
                  <div className="hidden text-[12px] text-white">typing</div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default UsersList;
