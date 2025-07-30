// src/components/post/admin/PostStatusTimeline.jsx
import React from "react";

const statuses = ["pending", "under investigation", "resolved", "rejected"];

const PostStatusTimeline = ({ currentStatus }) => {
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="flex justify-between items-center py-4">
      {statuses.map((status, index) => (
        <div key={status} className="flex flex-col items-center text-xs">
          <div
            className={`w-4 h-4 rounded-full ${
              index <= currentIndex ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          <span className="mt-1">{status}</span>
        </div>
      ))}
    </div>
  );
};

export default PostStatusTimeline;
