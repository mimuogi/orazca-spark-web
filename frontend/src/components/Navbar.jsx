import { Link } from 'react-router-dom';
import styles from './styles/Navbar.module.css';

function Navbar() {
  return (
    <nav className={styles.nav}>
      <h1 className={styles.logo}>Orazca Spark</h1>
      <ul className={styles.links}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/tools">Tools</Link></li>
        <li><Link to="/posts">Posts</Link></li>
        <li><Link to="/decks">Decks</Link></li>
        <li><Link to="/deck-collection">Collection</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
