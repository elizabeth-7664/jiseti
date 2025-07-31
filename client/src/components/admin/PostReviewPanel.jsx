import React, { useState } from "react";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import { updateReportStatus } from "../../utils/api";

const statusOptions = ["draft", "under-investigation", "resolved", "rejected"];

const PostReviewPanel = ({ postId, initialStatus, onStatusUpdated }) => {
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      const updated = await updateReportStatus(postId, {
        status: newStatus,
        admin_notes: notes,
      });
      setStatus(updated.status);
      onStatusUpdated?.(updated);
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 space-y-6">
      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text pr-2">
          Admin Review
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-500 dark:text-purple-400 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.944 12c.045 4.095 1.704 7.755 4.368 10.055a11.955 11.955 0 008.618-3.04A12.001 12.001 0 0021.056 12c-.045-4.095-1.704-7.755-4.368-10.055z"
          />
        </svg>
      </h3>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add optional notes for this review..."
        className="w-full p-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-700 focus:border-blue-400 dark:focus:border-blue-600 transition duration-200 ease-in-out"
        rows="4"
      />
      <div className="flex flex-wrap gap-3 pt-2">
        {statusOptions.map((option) => (
          <Button
            key={option}
            variant={status === option ? "primary" : "outline"}
            disabled={loading}
            onClick={() => handleStatusChange(option)}
            className={`
              px-6 py-2.5 text-sm font-semibold rounded-lg shadow-sm
              transition-all duration-300 ease-in-out
              ${
                status === option
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white transform scale-105"
                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              }
            `}
          >
            {option.replace(/-/g, " ")}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PostReviewPanel;