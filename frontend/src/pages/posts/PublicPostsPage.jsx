import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PublicPostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('/api/posts').then((res) => setPosts(res.data));
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Posts públicos</h1>
      <Link to="/my-posts" className="text-blue-600 underline">Ir a mis posts</Link>
      <ul className="mt-4">
        {posts.map(post => (
          <li key={post._id} className="mb-2">
            <Link to={`/posts/${post._id}`} className="text-lg font-semibold text-blue-700 hover:underline">
              {post.title}
            </Link>
            <p className="text-sm text-gray-500">por {post.authorId.username}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default PublicPostsPage;