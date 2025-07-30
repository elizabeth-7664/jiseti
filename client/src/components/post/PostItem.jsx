// src/components/post/PostItem.jsx
import React from "react";
import { Card, CardContent } from "../ui/Card";
import PostStatusBadge from "./PostStatusBadge";
import { formatDate } from "../../utils/utils";

const PostItem = ({ post }) => {
  return (
    <Card className="hover:shadow-lg transition">
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">{post.title}</h3>
          <PostStatusBadge status={post.status} />
        </div>
        <p className="text-sm text-muted-foreground">{formatDate(post.created_at)}</p>
        <p className="line-clamp-3">{post.description}</p>
        <div className="text-xs text-right text-gray-400">{post.category?.toUpperCase()}</div>
      </CardContent>
    </Card>
  );
};

export default PostItem;
