import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

function PostEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('draft');
  const [isEditing, setIsEditing] = useState(false);
  const [postIdState, setPostIdState] = useState(null);

  const navigate = useNavigate();
  const { postId } = useParams();
  const { token } = useUser();

  useEffect(() => {
    if (postId) {
      setIsEditing(true);
      setPostIdState(postId);
      axios.get(`/api/posts/${postId}`).then((res) => {
        const { title, contentMarkdown, coverImage, status } = res.data;
        setTitle(title);
        setContent(contentMarkdown);
        setCoverImage(coverImage || '');
        setStatus(status);
      });
    }
  }, [postId]);

  const handleSubmit = async () => {
    const postData = {
      title,
      contentMarkdown: content,
      coverImage,
      status,
    };
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      if (isEditing) {
        await axios.put(`/api/posts/${postId}`, postData, { headers });
        navigate('/my-posts');
      } else {
        const res = await axios.post('/api/posts', postData, { headers });
        setPostIdState(res.data._id);
        setIsEditing(true);
        window.history.replaceState(null, '', `/edit-post/${res.data._id}`);
      }
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{isEditing ? 'Editar post' : 'Crear nuevo post'}</h1>
      <input
        className="w-full p-2 border rounded mb-4"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="mb-4">
        <label className="block mb-1 font-medium">Imagen de portada (URL)</label>
        <input
          className="w-full p-2 border rounded"
          placeholder="https://..."
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
        />
      </div>

      <div data-color-mode="light">
        <MDEditor value={content} onChange={setContent} height={400} />
      </div>

      <div className="mt-4">
        <label className="mr-2">Estado:</label>
        <select
          className="border rounded p-1"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="draft">Borrador</option>
          <option value="private">Privado</option>
          <option value="public">Publicado</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isEditing ? 'Guardar cambios' : 'Publicar'}
      </button>
    </div>
  );
}

export default PostEditor;
