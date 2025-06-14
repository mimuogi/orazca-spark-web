import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

function ProfilePage() {
  const { id } = useParams();
  const { user } = useUser();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get(`/api/users/${id}`)
      .then(res => setProfile(res.data))
      .catch(err => console.error('Error al cargar perfil', err));
  }, [id]);

  if (!profile) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-2">{profile.username}</h1>
        {profile.profilePicture && <img src={profile.profilePicture} alt="Foto de perfil" className="w-24 h-24 rounded-full mb-4" />}
        <p className="text-gray-600">{profile.location}</p>
        <p className="mt-4">{profile.bio || 'Sin biografía aún.'}</p>
        <div className="flex gap-4 mt-2 text-sm text-gray-500">
          <span>Seguidores: {profile.followers?.length || 0}</span>
          <span>Siguiendo: {profile.following?.length || 0}</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 text-sm text-blue-600">
          {profile.socialLinks?.twitter && <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>}
          {profile.socialLinks?.facebook && <a href={profile.socialLinks.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
          {profile.socialLinks?.instagram && <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
          {profile.socialLinks?.youtube && <a href={profile.socialLinks.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>}
        </div>

        <p className="text-sm text-gray-400 mt-2">Miembro desde {new Date(profile.createdAt).toLocaleDateString()}</p>

        {user?._id === profile._id && (
          <Link to={`/profile/${user._id}/edit`} className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded">Editar Perfil</Link>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;