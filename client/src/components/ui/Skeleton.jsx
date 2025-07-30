// src/components/ui/Skeleton.jsx
import React from "react";

export default function Skeleton({ className }) {
  return (
    <div
      className={`bg-gray-200 animate-pulse rounded-md ${className}`}
    ></div>
  );
}
