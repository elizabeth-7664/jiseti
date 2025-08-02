// src/components/comments/Comments.jsx

import React, { useEffect, useState } from "react";
import { getComments, postComment } from "../../utils/api";
import Spinner from "../ui/Spinner"; // Optional spinner component

const Comments = ({ reportId, onCountChange }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(reportId);
        setComments(response.data);
        if (typeof onCountChange === "function") {
          onCountChange(response.data.length);
        }
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [reportId, onCountChange]);

  const handleAddComment = async () => {
    if (!content.trim()) return;
    try {
      const response = await postComment(reportId, { content });
      const newComments = [...comments, response.data];
      setComments(newComments);
      setContent("");
      if (typeof onCountChange === "function") {
        onCountChange(newComments.length);
      }
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="mt-4">
      <div className="space-y-3 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-3 rounded bg-gray-100">
            {comment.content}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default Comments;
