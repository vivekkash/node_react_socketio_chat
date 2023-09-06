import { Navbar } from 'flowbite-react';
import { FaRegMessage } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <Navbar fluid className="h-full py-2">
      <Navbar.Brand className="text-md md:text-xl font-semibold">
        <FaRegMessage className="font-bold text-2xl text-gray-400 mx-2" /> Gups
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="bg-white z-10 text-sm py-1 w-2/3">
        <Link to="/">
          <p className="p-2 border-[1px] border-dotted border-b-gray-400 md:border-none">
            Home
          </p>
        </Link>

        <Link to="/chat">
          <p className="p-2 border-[1px] border-dotted border-b-gray-400 md:border-none">
            Chat
          </p>
        </Link>

        <Link to="/live">
          <p className="p-2 border-[1px] border-dotted border-b-gray-400 md:border-none">
            Live Users
          </p>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
