import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import API from '../api/axios';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const userId = getUserIdFromToken();

  const fetchPost = () => {
    API.get(`/posts/${id}`).then(res => setPost(res.data)).catch(console.error);
  };

  useEffect(fetchPost, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/posts/${id}/comments`, { text: newComment });
      setNewComment('');
      fetchPost();
    } catch {
      alert('Error adding comment');
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      await API.put(`/posts/${id}/comments/${commentId}`, { text: editText });
      setEditCommentId(null);
      fetchPost();
    } catch {
      alert('Error editing comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('¿Eliminar comentario?')) return;
    await API.delete(`/posts/${id}/comments/${commentId}`);
    fetchPost();
  };

  function getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch {
      return null;
    }
  }

  if (!post) return <p>Cargando...</p>;

  return (
    <div>
      <h2>{post.title}</h2>
      <div className="markdown">
        <ReactMarkdown>{post.contentMarkdown}</ReactMarkdown>
      </div>


      <hr />
      <h3>Comentarios</h3>

      <form onSubmit={handleAddComment}>
        <textarea
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        /><br />
        <button type="submit">Añadir comentario</button>
      </form>

      <ul>
        {post.comments.map(comment => (
          <li key={comment._id} style={{ marginBottom: '1rem' }}>
            {editCommentId === comment._id ? (
              <>
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                /><br />
                <button onClick={() => handleEditComment(comment._id)}>💾 Guardar</button>
                <button onClick={() => setEditCommentId(null)}>✖ Cancelar</button>
              </>
            ) : (
              <>
                <ReactMarkdown>{comment.text}</ReactMarkdown>
                {comment.userId === userId && (
                  <>
                    <button onClick={() => {
                      setEditCommentId(comment._id);
                      setEditText(comment.text);
                    }}>✏️ Editar</button>
                    <button onClick={() => handleDeleteComment(comment._id)}>🗑️ Eliminar</button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostDetail;
