const Message = ({ data, id }) => {
  return data.type && data.type === 'notification' ? (
    <div className="bg-yellow-200 text-[12px] p-2 rounded-md mx-auto mb-3 text-center">
      <span className="font-semibold pr-1">{data.name}</span>
      {data.message}
    </div>
  ) : data.id === id ? (
    <div className="bg-blue-500 text-[12px] p-2 rounded-md max-w-[75%] mb-3 self-end text-white flex flex-col items-end">
      <div className="font-semibold mb-2">you</div>
      <div>{data.message}</div>
    </div>
  ) : (
    <div className="bg-zinc-300 text-[12px] p-2 rounded-md max-w-[75%] mb-3 self-start flex flex-col items-start">
      <div className="font-semibold mb-2">{data.name}</div>
      <div>{data.message}</div>
    </div>
  );
};

export default Message;
