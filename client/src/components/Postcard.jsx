import React from 'react';

const PostCard = ({ post }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4 mb-3">
        <img
          src={post.user?.profilePicture || 'https://via.placeholder.com/40'}
          alt={post.user?.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold">{post.user?.username}</h4>
          <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
        </div>
      </div>
      <h3 className="text-lg font-bold mb-2">{post.title}</h3>
      <p className="text-gray-700 text-sm">{post.content}</p>
    </div>
  );
};

export default PostCard;
