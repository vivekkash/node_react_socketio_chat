import { FaRegMessage } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="h-16 bg-white w-full fixed top-0 flex justify-between items-center px-4">
      <div className="text-xl font-semibold">
        <Link to="/">
          <span className="inline-block">
            <FaRegMessage />
          </span>{' '}
          <span>Gups </span>
        </Link>
      </div>
      <div className="text-md font-light">
        <ul className="flex gap-4">
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/join">
            <li>Chat</li>
          </Link>
          <Link to="/live">
            <li>Live</li>
          </Link>
          <Link to="/video">
            <li>Video</li>
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
