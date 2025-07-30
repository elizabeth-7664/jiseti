// src/components/post/admin/AdminPostTable.jsx
import React from "react";
import PostStatusBadge from "../post/PostStatusBadge"; // Assuming correct path
import Button from "../ui/Button"; // Assuming correct path
import { Eye } from "lucide-react";

const AdminPostTable = ({ posts, onView }) => {
  // Defensive programming: Ensure posts is an array or default to empty array
  const postsToDisplay = posts || []; // If posts is undefined/null, use an empty array

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Type</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {postsToDisplay.length === 0 ? ( // Optional: Add a message if no posts
            <tr>
              <td colSpan="5" className="p-3 text-center text-gray-500">
                No posts available.
              </td>
            </tr>
          ) : (
            // Use postsToDisplay instead of posts directly
            postsToDisplay.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="p-3">{post.title}</td>
                <td className="p-3 capitalize">{post.type}</td>
                <td className="p-3">
                  <PostStatusBadge status={post.status} />
                </td>
                <td className="p-3">
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-center">
                  <Button variant="ghost" size="sm" onClick={() => onView(post)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPostTable;