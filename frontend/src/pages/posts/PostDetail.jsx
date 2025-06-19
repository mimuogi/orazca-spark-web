import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useUser } from '../../context/UserContext';

function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState({});
  const user = useUser();

  useEffect(() => {
    axios.get(`/api/posts/${slug}`)
      .then(res => {
        setPost(res.data);
        return axios.get(`/api/comments?postId=${res.data._id}`);
      })
      .then(res => {
        setComments(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Error al cargar post');
        setLoading(false);
      });
  }, [slug]);

  const fetchComments = async () => {
    const res = await axios.get(`/api/comments?postId=${post._id}`);
    setComments(res.data);
  };

  const handleVote = async (type) => {
    try {
      const res = await axios.post(`/api/posts/${post._id}/${type}`);
      setPost(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al votar');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await axios.post(`/api/comments`, { text: commentText, postId: post._id });
      await fetchComments();
      setCommentText('');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al comentar');
    }
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await axios.post(`/api/comments`, { text: replyText, postId: post._id, parentId });
      setReplyingToId(null);
      setReplyText('');
      await fetchComments();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al responder');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/comments/${editingCommentId}`, { text: editingText });
      setEditingCommentId(null);
      setEditingText('');
      await fetchComments();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al editar comentario');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este comentario?')) return;
    try {
      await axios.delete(`/api/comments/${id}`);
      await fetchComments();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar comentario');
    }
  };

  const toggleReplies = (id) => {
    setExpandedReplies(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderComments = (parentId = null) => {
    return comments
      .filter(c => c.parentId === parentId)
      .map(c => {
        const replies = comments.filter(r => r.parentId === c._id);
        const isExpanded = expandedReplies[c._id];

        return (
          <li key={c._id} className="bg-gray-100 p-3 rounded-xl">
            {editingCommentId === c._id ? (
              <form onSubmit={handleEditSubmit} className="mb-2">
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="2"
                />
                <div className="mt-2 flex gap-2">
                  <button type="submit" className="bg-green-600 text-white px-2 py-1 rounded">Guardar</button>
                  <button type="button" onClick={() => setEditingCommentId(null)} className="bg-gray-400 text-white px-2 py-1 rounded">Cancelar</button>
                </div>
              </form>
            ) : (
              <>
                <p className="text-sm text-gray-800">{c.text}</p>
                <p className="text-xs text-gray-500 mt-1">por {c.userId?.username || 'anónimo'} — {new Date(c.createdAt).toLocaleDateString()}</p>
                <div className="text-xs mt-1 flex gap-2 flex-wrap">
                  {user?.user._id === c.userId?._id && (
                    <button onClick={() => { setEditingCommentId(c._id); setEditingText(c.text); }} className="text-blue-600 hover:underline">Editar</button>
                  )}
                  {(user?.user._id === c.userId?._id || user?.user._id === post.authorId?._id) && (
                    <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:underline">Eliminar</button>
                  )}
                  {user && (
                    <button onClick={() => { setReplyingToId(c._id); setReplyText(''); }} className="text-indigo-600 hover:underline">Responder</button>
                  )}
                  {replies.length > 0 && (
                    <button onClick={() => toggleReplies(c._id)} className="text-gray-700 hover:underline">
                      {isExpanded ? 'Ocultar respuestas' : `Ver respuestas (${replies.length})`}
                    </button>
                  )}
                </div>
                {replyingToId === c._id && (
                  <form onSubmit={(e) => handleReplySubmit(e, c._id)} className="mt-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-2 border rounded"
                      rows="2"
                      placeholder="Escribe una respuesta..."
                    />
                    <div className="mt-1 flex gap-2">
                      <button type="submit" className="bg-blue-600 text-white px-2 py-1 rounded">Responder</button>
                      <button type="button" onClick={() => setReplyingToId(null)} className="bg-gray-400 text-white px-2 py-1 rounded">Cancelar</button>
                    </div>
                  </form>
                )}
              </>
            )}
            {isExpanded && replies.length > 0 && (
              <ul className="ml-6 mt-2 space-y-2">
                {renderComments(c._id)}
              </ul>
            )}
          </li>
        );
      });
  };

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white rounded-2xl shadow">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-600 mb-4">
        por {post.authorId.username} — {new Date(post.createdAt).toLocaleDateString()}
      </p>

      <div className="prose prose-sm sm:prose lg:prose-lg">
        <ReactMarkdown>{post.contentMarkdown}</ReactMarkdown>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <button onClick={() => handleVote('like')} className="flex items-center gap-1 text-green-600 hover:text-green-800">
          <span className="font-bold text-xl">+</span> {post.likes || 0}
        </button>
        <button onClick={() => handleVote('dislike')} className="flex items-center gap-1 text-red-600 hover:text-red-800">
          <span className="font-bold text-xl">−</span> {post.dislikes || 0}
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Comentarios</h2>

        {user && (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escribe tu comentario..."
              className="w-full p-2 border rounded-xl mb-2"
              rows="3"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              Comentar
            </button>
          </form>
        )}

        {comments.length === 0 ? (
          <p className="text-gray-500">No hay comentarios aún.</p>
        ) : (
          <ul className="space-y-4">
            {renderComments()}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PostDetail;
