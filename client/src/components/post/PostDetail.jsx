// src/components/post/PostDetails.jsx
import React from "react";
import { Badge } from "../ui/Badge";
//import { formatDate } from "../../utils/dateUtils";

const PostDetails = ({ post }) => {
  if (!post) return <div>No post data available.</div>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{post.title}</h2>
        <Badge variant="outline">{post.status}</Badge>
      </div>
      <p className="text-gray-600">{post.description}</p>

      <div className="text-sm text-gray-500">
        <p>Created: {formatDate(post.created_at)}</p>
        <p>Type: <span className="font-medium capitalize">{post.type}</span></p>
        <p>Location: ({post.latitude}, {post.longitude})</p>
      </div>

      {post.media?.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {post.media.map((file, idx) => (
            <img
              key={idx}
              src={file.url}
              alt={`Media ${idx + 1}`}
              className="rounded-xl h-32 object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostDetails;
