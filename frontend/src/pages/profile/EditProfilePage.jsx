import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

function EditProfilePage() {
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const { user, login } = useUser();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`/api/users/${id}/private`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUserData(res.data))
      .catch(err => console.error('Error al cargar datos privados del perfil', err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split('.');
    if (keys.length > 1) {
      setUserData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await axios.put(`/api/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    login(token); // refrescar datos de usuario en contexto
    alert('Perfil actualizado');
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="username" value={userData.username || ''} onChange={handleChange} placeholder="Username" className="w-full p-2 border rounded" />
        <input name="email" value={userData.email || ''} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
        <input name="profilePicture" value={userData.profilePicture || ''} onChange={handleChange} placeholder="URL Foto de Perfil" className="w-full p-2 border rounded" />
        <textarea name="bio" value={userData.bio || ''} onChange={handleChange} placeholder="Biografía" className="w-full p-2 border rounded" />
        <input name="location" value={userData.location || ''} onChange={handleChange} placeholder="Ubicación" className="w-full p-2 border rounded" />
        <input name="website" value={userData.website || ''} onChange={handleChange} placeholder="Sitio web" className="w-full p-2 border rounded" />
        <input type="date" name="birthday" value={userData.birthday?.split('T')[0] || ''} onChange={handleChange} className="w-full p-2 border rounded" />

        <select name="preferences.theme" value={userData.preferences?.theme || 'light'} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
        </select>

        <input name="preferences.language" value={userData.preferences?.language || 'en'} onChange={handleChange} placeholder="Idioma" className="w-full p-2 border rounded" />

        <label>
          <input type="checkbox" name="notifications.email" checked={userData.notifications?.email || false} onChange={handleChange} /> Notificaciones por email
        </label>
        <label>
          <input type="checkbox" name="notifications.push" checked={userData.notifications?.push || false} onChange={handleChange} /> Notificaciones push
        </label>

        <input name="socialLinks.twitter" value={userData.socialLinks?.twitter || ''} onChange={handleChange} placeholder="Twitter" className="w-full p-2 border rounded" />
        <input name="socialLinks.facebook" value={userData.socialLinks?.facebook || ''} onChange={handleChange} placeholder="Facebook" className="w-full p-2 border rounded" />
        <input name="socialLinks.instagram" value={userData.socialLinks?.instagram || ''} onChange={handleChange} placeholder="Instagram" className="w-full p-2 border rounded" />
        <input name="socialLinks.youtube" value={userData.socialLinks?.youtube || ''} onChange={handleChange} placeholder="YouTube" className="w-full p-2 border rounded" />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar cambios</button>
      </form>
    </div>
  );
}

export default EditProfilePage;
