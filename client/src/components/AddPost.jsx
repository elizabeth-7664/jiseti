import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

export const AddPost = ({ close }) => {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/posts`, { title, content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      close();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to add post');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">New Post</h2>
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full mb-3 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          className="border p-2 w-full mb-3 rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={close} className="text-gray-600">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Post</button>
        </div>
      </form>
    </div>
  );
};
