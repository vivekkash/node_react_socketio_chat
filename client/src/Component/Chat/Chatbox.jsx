import { useState } from 'react';

const Chatbox = () => {
  const [message, setMessage] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    console.log('Submitted');
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
      <div className="w-full md:w-1/3 bg-white h-full rounded-lg shadow-lg">
        <div className="border-2 m-2 p-2 h-4/5 overflow-y-scroll">123</div>
        <div className="border-2 m-2 h-24">
          <form onSubmit={submitHandler} className="flex items-center">
            <textarea
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 h-14 border-[1px] border-gray-300"
            />
            <button className="h-14 p-2 w-20 bg-gray-300">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
