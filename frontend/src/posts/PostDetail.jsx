import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '@/components/ui/card';

const PostDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then(res => res.json())
        .then(data => setPost(data));
    }
  }, [id]);

  if (!post) return <p className="text-center mt-10">Cargando post...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <Card>
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <p className="text-sm text-gray-500">Tags: {post.tags.join(', ')}</p>
          <div className="prose">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetail;
