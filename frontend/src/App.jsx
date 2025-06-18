import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import PrivateRoute from './components//PrivateRoute';
import Home from './pages/Home';
import LoginPage from './pages/users/LoginPage';
import RegisterPage from './pages/users/RegisterPage';
import ProfilePage from './pages/profile/ProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';
import PublicPostsPage from './pages/posts/PublicPostsPage';
import UserPostsPage from './pages/posts/UserPostsPage';
import PostEditor from './pages/posts/PostEditor';
import PostDetail from './pages/posts/PostDetail';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route path="profile/:id" element={<ProfilePage />} />

        <Route path="posts" element={<PublicPostsPage />} />
        <Route path="posts/:slug" element={<PostDetail />} />
        
        {/* Ruta para manejar 404 */}
        <Route path="*" element={<h1 className="text-center mt-10">Página no encontrada</h1>} />

        {/* Rutas privadas */}

        <Route element={<PrivateRoute />}>
          <Route path="profile/:id/edit" element={<EditProfilePage />} />
          <Route path="my-posts" element={<UserPostsPage />} />
          <Route path="new-post" element={<PostEditor />} />
          <Route path="posts/:postId/edit" element={<PostEditor />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
