import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h1 style={styles.logo}>Orazca Spark</h1>
      <ul style={styles.links}>
        <li><Link to="/">Home</Link></li>
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

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#111',
    padding: '1rem',
    color: 'white'
  },
  logo: {
    margin: 0
  },
  links: {
    listStyle: 'none',
    display: 'flex',
    gap: '1rem',
    margin: 0,
    padding: 0
  }
};

export default Navbar;
