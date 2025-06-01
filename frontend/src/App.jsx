import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostsList from './pages/PostsList';
import PostDetail from './pages/PostDetail';
import DeckList from './pages/DeckList';
import DeckDetail from './pages/DeckDetail';
import Profile from './pages/UserProfile';
import DeckCollection from './pages/DeckCollection';
import DeckTools from './pages/DeckTools';
import ManaTool from './pages/ManaTool';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts" element={<PostsList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/decks" element={<DeckList />} />
        <Route path="/decks/:id" element={<DeckDetail />} />
        <Route path="/deck-collection" element={<DeckCollection />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tools" element={<DeckTools/>}/>
        <Route path="/tools/mana" element={<ManaTool />} />
      </Routes>
    </>
  );
}

export default App;
