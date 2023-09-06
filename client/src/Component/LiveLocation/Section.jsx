import Row from './Row';
import Store from '../../Store';
import { useContext, useEffect, useState } from 'react';

const Section = () => {
  const socket = useContext(Store);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.emit('ping-active-users', {});
    socket.on('all_active_users', (active_users) => {
      setUsers(active_users);
    });
  }, [socket]);
  return (
    <div className="relative mt-20 px-4">
      <h1 className="text-md md:text-lg font-semibold py-3">Live users</h1>
      <div className="w-full flex justify-center">
        <div className="p-2 md:p-4 bg-white w-full">
          {users.length > 0 &&
            users.map(
              (user, i) => user && <Row key={i} user={user} index={i} />
            )}
        </div>
      </div>
    </div>
  );
};

export default Section;
