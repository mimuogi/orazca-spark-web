import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const PostManager = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingPost ? 'PUT' : 'POST';
    const url = editingPost ? `/api/posts/${editingPost._id}` : '/api/posts';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, tags: tags.split(',').map(t => t.trim()) })
    });

    if (res.ok) {
      setMessage(editingPost ? 'Post actualizado' : 'Post creado');
      setTitle('');
      setContent('');
      setTags('');
      setEditingPost(null);
      fetchPosts();
    } else {
      setMessage('Error al guardar el post');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setTags(post.tags.join(', '));
  };

  const handleDelete = async (id) => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  const handleView = (id) => {
    router.push(`/posts/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <Card className="mb-6">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">{editingPost ? 'Editar Post' : 'Crear nuevo Post'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Contenido en markdown"
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Tags (separados por comas)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <Button type="submit">{editingPost ? 'Actualizar' : 'Crear'}</Button>
          </form>
          {message && <p className="mt-4 text-sm text-center">{message}</p>}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post._id} className="p-4">
            <CardContent>
              <h3 className="text-lg font-semibold cursor-pointer" onClick={() => handleView(post._id)}>{post.title}</h3>
              <p className="text-sm text-gray-500">Tags: {post.tags.join(', ')}</p>
              <div className="mt-2 space-x-2">
                <Button onClick={() => handleEdit(post)}>Editar</Button>
                <Button variant="destructive" onClick={() => handleDelete(post._id)}>Eliminar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostManager;
