// src/components/post/Comments.jsx

import React, { useEffect, useState } from "react";
import { getComments, postComment } from "../../utils/api";
import Spinner from "../ui/Spinner";
import { Send, User as UserIcon } from "lucide-react";

const Comments = ({ reportId, onCountChange }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Comments ({comments.length})
      </h3>

      <div className="space-y-4 mb-8">
        {comments.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <UserIcon size={18} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    User {comment.created_by ? comment.created_by.substring(0, 8) : "Anonymous"}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddComment} className="flex items-end gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
        <div className="flex-1">
          <label htmlFor="comment-input" className="sr-only">Write a comment</label>
          <textarea
            id="comment-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            rows="2"
            className="w-full resize-none bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm p-0"
            style={{ minHeight: "44px" }}
          />
        </div>
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="shrink-0 w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Post comment"
        >
          {submitting ? <Spinner className="w-4 h-4 border-2 border-white/20 border-t-white" /> : <Send size={16} className="ml-0.5" />}
        </button>
      </form>
    </div>
  );
};

export default Comments;
