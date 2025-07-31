import React from "react";
import PostStatusBadge from "../post/PostStatusBadge";
import Button from "../ui/Button";
import { Eye } from "lucide-react";

const AdminPostTable = ({ posts, onView }) => {
  const postsToDisplay = posts || [];

  return (
    <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {postsToDisplay.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No posts available.
              </td>
            </tr>
          ) : (
            postsToDisplay.map((post, index) => (
              <tr
                key={post.id}
                className={
                  index % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                }
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {post.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {post.type}
                </td>
                <td className="px-6 py-4">
                  <PostStatusBadge status={post.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(post)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 ease-in-out"
                  >
                    <Eye className="w-4 h-4 mr-1 inline-block" />
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