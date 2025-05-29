import { useEffect, useState } from 'react';
import CreatePost from '../components/CreatePost';
import API from '../api/axios';

function PostsList() {
  const [posts, setPosts] = useState([]);
  const [editPostId, setEditPostId] = useState(null);
  const [editFields, setEditFields] = useState({});

  const fetchPosts = () => {
    API.get('/posts').then(res => setPosts(res.data)).catch(() => setPosts([]));
  };

  useEffect(fetchPosts, []);

  const handleEditChange = (e) =>
    setEditFields({ ...editFields, [e.target.name]: e.target.value });

  const saveEdit = async (id) => {
    try {
      await API.put(`/posts/${id}`, editFields);
      setEditPostId(null);
      fetchPosts();
    } catch (err) {
      console.error('Error al editar');
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm('¿Eliminar post?')) return;
    await API.delete(`/posts/${id}`);
    fetchPosts();
  };

  return (
    <div>
      <h1>All Posts</h1>
      <CreatePost onCreated={fetchPosts} />
      <hr />
      <h2>Post List</h2>
      <ul>
        {posts.map(post =>
          <li key={post._id}>
            {editPostId === post._id ? (
              <>
                <input name="title" defaultValue={post.title} onChange={handleEditChange} />
                <input name="contentMarkdown" defaultValue={post.contentMarkdown} onChange={handleEditChange} />
                <button onClick={() => saveEdit(post._id)}>💾 Guardar</button>
                <button onClick={() => setEditPostId(null)}>✖ Cancelar</button>
              </>
            ) : (
              <>
                <strong>{post.title}</strong> – {post.slug}
                <button onClick={() => {
                  setEditPostId(post._id);
                  setEditFields({ title: post.title, contentMarkdown: post.contentMarkdown });
                }}>✏️ Editar</button>
                <button onClick={() => deletePost(post._id)}>🗑️ Eliminar</button>
              </>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}

export default PostsList;
