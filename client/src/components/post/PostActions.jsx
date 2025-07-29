// src/components/post/PostActions.jsx
import React from "react";
import  Button  from "./components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const PostActions = ({ canEdit, canDelete, onEdit, onDelete }) => {
  return (
    <div className="flex gap-2 mt-2">
      {canEdit && (
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="w-4 h-4 mr-1" />
          Edit
        </Button>
      )}
      {canDelete && (
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      )}
    </div>
  );
};

export default PostActions;
