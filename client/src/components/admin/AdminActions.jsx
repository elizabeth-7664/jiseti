import React, { useState } from "react";
import  Button  from "../ui/Button";
import  Textarea  from "../ui/Textarea";
import { Badge } from "../ui/Badge";

export const AdminActions = ({ reportId, currentStatus, onActionSubmit }) => {
  const [action, setAction] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleActionClick = async (selectedAction) => {
    if (selectedAction === "approved") {
      await submitAction(selectedAction);
    } else {
      setAction(selectedAction);
    }
  };

  const submitAction = async (status) => {
    setLoading(true);
    try {
      // Optional: Replace with your actual API call
      await onActionSubmit({ reportId, status, comment });
      setAction(null);
      setComment("");
    } catch (error) {
      console.error("Failed to submit admin action", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 shadow-md space-y-4">
      <h3 className="text-lg font-semibold">Admin Actions</h3>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => handleActionClick("approved")} disabled={loading}>
          Approve
        </Button>
        <Button variant="destructive" onClick={() => handleActionClick("rejected")} disabled={loading}>
          Reject
        </Button>
        <Button variant="outline" onClick={() => handleActionClick("needs_more_info")} disabled={loading}>
          Request Info
        </Button>
      </div>

      {action && (
        <div className="space-y-2 mt-2">
          <Textarea
            placeholder={`Add a comment for why you're ${action.replace(/_/g, " ")}...`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={() => submitAction(action)} disabled={loading || !comment}>
            Submit
          </Button>
        </div>
      )}

      <div className="mt-2 text-sm text-gray-600">
        Current Status: <Badge variant="outline">{currentStatus}</Badge>
      </div>
    </div>
  );
};
