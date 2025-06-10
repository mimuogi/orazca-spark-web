import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, tags: tags.split(',').map(t => t.trim()) })
    });

    if (res.ok) {
      setMessage('Post creado con éxito');
      setTitle('');
      setContent('');
      setTags('');
    } else {
      setMessage('Error al crear el post');
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8 p-4">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Crear nuevo Post</h2>
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
          <Button type="submit">Crear Post</Button>
        </form>
        {message && <p className="mt-4 text-sm text-center">{message}</p>}
      </CardContent>
    </Card>
  );
};

export default CreatePost;
