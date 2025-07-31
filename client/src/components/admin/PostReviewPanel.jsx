// src/components/post/admin/PostReviewPanel.jsx
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
    <div className="p-4 border rounded-xl bg-white shadow-sm space-y-3">
      <h3 className="font-semibold text-lg">Admin Review</h3>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional notes..."
      />
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <Button
            key={option}
            variant={status === option ? "default" : "outline"}
            disabled={loading}
            onClick={() => handleStatusChange(option)}
          >
            {option.replace(/-/g, " ")} {/* Display with spaces for readability */}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PostReviewPanel;