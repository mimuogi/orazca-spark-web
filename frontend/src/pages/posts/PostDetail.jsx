import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/posts/${id}`)
      .then(res => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Error al cargar post');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white rounded-2xl shadow">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-600 mb-4">por {post.authorId.username} — {new Date(post.createdAt).toLocaleDateString()}</p>
      <div className="prose prose-sm sm:prose lg:prose-lg">
        <ReactMarkdown>{post.contentMarkdown}</ReactMarkdown>
      </div>
    </div>
  );
}

export default PostDetail;