// src/components/post/PostList.jsx
import React from "react";
import PostItem from "./PostItem";

const PostList = ({ posts }) => {
  if (!posts?.length) {
    return <p className="text-center text-gray-500">No reports found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
