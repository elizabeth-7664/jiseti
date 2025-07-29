// src/components/post/PostStatusBadge.jsx
import React from "react";
import { Badge } from "../ui/Badge";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  under_investigation: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const PostStatusBadge = ({ status }) => {
  return (
    <Badge className={`${statusColors[status] || "bg-gray-100 text-gray-700"}`}>
      {status.replace("_", " ")}
    </Badge>
  );
};

export default PostStatusBadge;
