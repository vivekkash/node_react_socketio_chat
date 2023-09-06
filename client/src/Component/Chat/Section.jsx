import { useEffect, useState } from 'react';
import Chatbox from './Chatbox';
import User from './User';

const Section = () => {
  const [page, setPage] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null;
    setPage(user);
  }, []);
  return (
    <div className="relative mt-20">
      {page == 'Chat' ? <Chatbox /> : <User setPage={setPage} />}
    </div>
  );
};

export default Section;
