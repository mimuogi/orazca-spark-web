import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Navbar() {
  const { user, logout } = useUser();

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Orazca Spark</Link>
        <div className="space-x-4">
          <Link to="/posts">Posts</Link>
          <Link to="/decks">Decks</Link>
          <Link to="/tools">Herramientas</Link>
          <Link to="/search">Buscar</Link>
          {user ? (
            <>
              <Link to={`/profile/${user._id}`}>{user.username}</Link>
              <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-500 px-3 py-1 rounded">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
