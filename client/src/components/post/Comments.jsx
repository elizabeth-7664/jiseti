// src/components/post/Comments.jsx

import React, { useEffect, useState } from "react";
import { getComments, postComment, updateComment, deleteComment } from "../../utils/api";
import Spinner from "../ui/Spinner";
import { Send, User as UserIcon, Edit2, Trash2, CornerDownRight, MessageSquare, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const CommentItem = ({ comment, allComments, onReply, onEdit, onDelete, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  
  const isOwner = currentUser?.id === comment.created_by;
  const isAdmin = currentUser?.is_admin;
  
  // Calculate if within 2 mins
  const createdDate = new Date(comment.created_at);
  const isEditable = isOwner && (new Date() - createdDate) < 120000;
  
  const replies = allComments.filter(c => c.parent_id === comment.id);
  
  const handleSave = () => {
    onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
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
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {createdDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                {comment.is_edited && " (edited)"}
              </span>
            </div>
          </div>
          
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm text-gray-900 dark:text-white"
                rows="2"
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleSave} className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-md">Save</button>
                <button onClick={() => setIsEditing(false)} className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
              {comment.content}
            </p>
          )}

          <div className="flex items-center gap-4 mt-3">
            <button onClick={() => onReply(comment.id, comment.created_by)} className="text-xs flex items-center gap-1 text-gray-500 hover:text-emerald-600 transition-colors">
              <MessageSquare size={14} /> Reply
            </button>
            {isEditable && (
              <button onClick={() => setIsEditing(true)} className="text-xs flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                <Edit2 size={14} /> Edit
              </button>
            )}
            {(isOwner || isAdmin) && (
              <button onClick={() => onDelete(comment.id)} className="text-xs flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors">
                <Trash2 size={14} /> Delete
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Nested Replies */}
      {replies.length > 0 && (
        <div className="ml-8 border-l-2 border-gray-100 dark:border-gray-700 pl-4">
          {replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              allComments={allComments} 
              onReply={onReply} 
              onEdit={onEdit} 
              onDelete={onDelete}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Comments = ({ reportId, onCountChange }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // { id, userId }

  useEffect(() => {
    fetchComments();
  }, [reportId]);

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

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const payload = { content };
      if (replyingTo) {
        payload.parent_id = replyingTo.id;
      }
      await postComment(reportId, payload);
      await fetchComments();
      setContent("");
      setReplyingTo(null);
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId, newContent) => {
    try {
      await updateComment(commentId, { content: newContent });
      await fetchComments();
    } catch (err) {
      alert("Failed to edit comment. It might be past the 2-minute window.");
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteComment(commentId);
      await fetchComments();
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  // Only render top-level comments directly, replies are handled recursively
  const topLevelComments = comments.filter(c => !c.parent_id);

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
          topLevelComments.map((comment) => (
            <CommentItem 
              key={comment.id}
              comment={comment}
              allComments={comments}
              onReply={(id, userId) => setReplyingTo({ id, userId })}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentUser={user}
            />
          ))
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-4 transition-all">
        {replyingTo && (
          <div className="flex items-center justify-between bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 text-xs px-3 py-2 rounded-lg mb-3">
            <span className="flex items-center gap-1">
              <CornerDownRight size={14} />
              Replying to User {replyingTo.userId.substring(0, 8)}
            </span>
            <button onClick={() => setReplyingTo(null)} className="hover:text-red-500 transition-colors">
              <X size={14} />
            </button>
          </div>
        )}
        <form onSubmit={handleAddComment} className="flex items-end gap-3">
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
    </div>
  );
};

export default Comments;
