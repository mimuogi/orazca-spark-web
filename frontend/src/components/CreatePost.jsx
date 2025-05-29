import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import API from '../api/axios';

function CreatePost({ onCreated }) {
  const [post, setPost] = useState({
    title: '',
    slug: '',
    contentMarkdown: '',
    tags: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await API.post('/posts', {
        ...post,
        tags: post.tags.split(',').map(tag => tag.trim())
      });
      setMessage(`✅ Post creado: ${response.data.title}`);
      setPost({ title: '', slug: '', contentMarkdown: '', tags: '' });
      if (onCreated) onCreated();
    } catch (err) {
      setMessage('❌ Error al crear post');
    }
  };

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={post.title} onChange={handleChange} /><br />
        <input name="slug" placeholder="Slug" value={post.slug} onChange={handleChange} /><br />
        <input name="tags" placeholder="Tags (comma separated)" value={post.tags} onChange={handleChange} /><br />
        <textarea
          name="contentMarkdown"
          placeholder="Markdown Content"
          value={post.contentMarkdown}
          onChange={handleChange}
          rows={6}
        /><br />
        <button type="submit">Create</button>
      </form>

      <hr />
      <h3>📄 Vista previa en Markdown</h3>
      <div className="markdown">
        <ReactMarkdown>{post.contentMarkdown}</ReactMarkdown>
      </div>


      {message && <p>{message}</p>}
    </div>
  );
}

export default CreatePost;
