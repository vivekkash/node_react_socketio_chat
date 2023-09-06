const Row = ({ user }) => {
  return (
    <div className="flex flex-wrap justify-evenly items-center py-2 text-[10px] md:text-[12px] border-[1px] border-b-gray-400 border-dotted">
      <div className="">{user.ip}</div>
      <div className="">{user.city}</div>
      <div className="">{user.state}</div>
      <div className="">{user.country}</div>
      <div className="">
        <img
          src={`https://flagsapi.com/${user.country_code}/flat/64.png`}
          className="h-6 w-6"
        />
      </div>
    </div>
  );
};

export default Row;
