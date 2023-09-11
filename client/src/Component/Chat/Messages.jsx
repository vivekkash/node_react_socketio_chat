import Message from './Message';

const Messages = ({ messages, id }) => {
  return (
    <div className="flex flex-col">
      {messages.length > 0 &&
        messages.map((m, i) => <Message key={i} data={m} id={id} />)}
    </div>
  );
};

export default Messages;
