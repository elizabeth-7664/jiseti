// src/components/post/PostItem.jsx
import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

// Helper function for styling report status badges
const getStatusClasses = (status) => {
  switch (status) {
    case "draft":
      return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200";
    case "under-investigation":
      return "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200";
    case "rejected":
      return "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200";
    case "resolved":
      return "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200";
    default:
      return "bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200";
  }
};

// Helper function to format dates for display
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return "N/A"; // Fallback for invalid date strings
  }
};

const PostItem = ({ post }) => {
  // --- ADDED THIS CONSOLE.LOG FOR DEBUGGING ---
  console.log("DEBUG PostItem: Rendering post. Title:", post.title, "ID:", post.id);
  // --- END DEBUG LOG ---

  return (
    <Link
      to={`/posts/${post.id}`} // The `post.id` value from the console log will be used here
      className="
        block
        bg-white dark:bg-gray-800
        rounded-xl
        shadow-lg hover:shadow-xl
        border border-gray-200 dark:border-gray-700
        transform hover:-translate-y-1
        transition-all duration-300 ease-in-out
        p-6
        flex flex-col
        h-full
      "
    >
      {/* Category and Status Badges */}
      <div className="flex justify-between items-center mb-3 text-xs font-semibold">
        <span
          className={`px-3 py-1 rounded-full capitalize ${
            post.category === "red-flag"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
          }`}
        >
          {post.category?.replace("-", " ") || "N/A"}
        </span>
        <span
          className={`px-3 py-1 rounded-full capitalize ${getStatusClasses(
            post.status
          )}`}
        >
          {post.status?.replace("_", " ") || "N/A"}
        </span>
      </div>

      {/* Post Title */}
      <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
        {post.title || "Untitled Report"}
      </h2>

      {/* Post Description */}
      <p className="text-gray-700 dark:text-gray-300 text-base mb-4 flex-grow line-clamp-3">
        {post.description || "No description provided."}
      </p>

      {/* Location, Author, and Date Information */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
        {post.location && (
          <p className="flex items-center mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 opacity-70"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {post.location}
          </p>
        )}
        <div className="flex justify-between items-center">
          {post.author?.username && (
            <p>By: {post.author.username}</p>
          )}
          <p>{formatDate(post.created_at)}</p>
        </div>
      </div>
    </Link>
  );
};

export default PostItem;