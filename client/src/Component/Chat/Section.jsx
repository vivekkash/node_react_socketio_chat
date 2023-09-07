import { useEffect, useState } from 'react';
import Chatbox from './Chatbox';
import User from './User';

const Section = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null;
    setUser(user);
  }, []);

  return (
    <div className="relative mt-20">
      {user ? <Chatbox user={user} /> : <User setUser={setUser} />}
    </div>
  );
};

export default Section;
