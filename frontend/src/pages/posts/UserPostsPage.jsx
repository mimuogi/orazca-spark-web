import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

function UserPostsPage() {
  const [posts, setPosts] = useState([]);
  const { token } = useUser();

  useEffect(() => {
    axios.get('/api/posts/mine', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setPosts(res.data));
  }, [token]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mis posts</h1>
      <Link to="/new-post" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block mb-4">
        Crear nuevo post
      </Link>
      <ul>
        {posts.map(post => (
          <li key={post._id} className="mb-2">
            <Link to={`/posts/${post._id}/edit`} className="text-blue-700 hover:underline">
              {post.title} ({post.status})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserPostsPage;
