import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useUser } from '../../context/UserContext';

function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const user = useUser();

  useEffect(() => {
    axios.get(`/api/posts/${slug}`)
      .then(res => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Error al cargar post');
        setLoading(false);
      });
  }, [slug]);

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
      const res = await axios.post(`/api/posts/${post._id}/comments`, { text: commentText });
      setPost(res.data);
      setCommentText('');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al comentar');
    }
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

        {post.comments.length === 0 ? (
          <p className="text-gray-500">No hay comentarios aún.</p>
        ) : (
          <ul className="space-y-4">
            {post.comments.map((c, i) => (
              <li key={i} className="bg-gray-100 p-3 rounded-xl">
                <p className="text-sm text-gray-800">{c.text}</p>
                <p className="text-xs text-gray-500 mt-1">por usuario {c.userId.username} — {new Date(c.timestamp).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PostDetail;