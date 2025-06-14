import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import PrivateRoute from './components//PrivateRoute';
import Home from './pages/Home';
import LoginPage from './pages/users/LoginPage';
import RegisterPage from './pages/users/RegisterPage';
import ProfilePage from './pages/profile/ProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route path="profile/:id" element={<ProfilePage />} />

        <Route element={<PrivateRoute />}>
          <Route path="profile/:id/edit" element={<EditProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
