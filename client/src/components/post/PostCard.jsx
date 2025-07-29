// src/components/post/Postcard.jsx
import React from "react";

export default function Postcard({ post, onEdit, onDelete }) {
  const {
    type,
    title,
    description,
    lat,
    lng,
    status,
    media = [],
    created_at,
  } = post;

  return (
    <div className="border rounded-xl p-4 shadow-sm space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-bold uppercase text-blue-600">{type}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColor(status)}`}>
          {status}
        </span>
      </div>

      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-700">{description}</p>

      {media.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {media.map((src, i) => (
            <img key={i} src={src} alt="media" className="h-20 w-20 object-cover rounded-md" />
          ))}
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button onClick={onEdit} className="text-sm text-blue-600 hover:underline">Edit</button>
        <button onClick={onDelete} className="text-sm text-red-600 hover:underline">Delete</button>
      </div>
    </div>
  );
}

const statusColor = (status) => {
  switch (status) {
    case "resolved":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    case "under investigation":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
