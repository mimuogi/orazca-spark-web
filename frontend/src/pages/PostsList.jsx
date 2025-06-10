import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from "@/components/ui/Card";
import CardContent from "@/components/ui/CardContent";

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      {posts.map(post => (
        <Card key={post._id} className="cursor-pointer" onClick={() => navigate(`/posts/${post._id}`)}>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500">Tags: {post.tags.join(', ')}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PostsList;