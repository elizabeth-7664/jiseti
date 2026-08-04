import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Edit2, Trash2, AlertTriangle, Activity } from "lucide-react";

const Postcard = ({ post, onEdit, onDelete }) => {
  const {
    id,
    _id,
    type,
    title,
    description,
    lat,
    lng,
    status,
    media = [],
    created_at,
  } = post;

  const postId = id || _id || Math.random().toString(36).substr(2, 9);

  // Formatted date
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const isRedFlag = type === "red-flag";
  const categoryColor = isRedFlag ? "bg-rose-500" : "bg-blue-500";
  const categoryBg = isRedFlag ? "bg-rose-500/10 text-rose-600 border-rose-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20";
  const CategoryIcon = isRedFlag ? AlertTriangle : Activity;

  return (
    <motion.div
      id={`post-${postId}`}
      className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 group"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      role="article"
      aria-labelledby={`post-title-${postId}`}
    >
      {/* Left Accent Border */}
      <div className={`absolute top-0 left-0 w-1.5 h-full ${categoryColor}`} />

      <div className="p-6 pl-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${categoryBg}`}>
            <CategoryIcon className="w-3.5 h-3.5" />
            {isRedFlag ? "Red Flag" : "Intervention"}
          </div>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full border ${statusColor(status)} shadow-sm`}
            aria-label={`Status: ${status}`}
          >
            {status ? status.replace("-", " ") : "Unknown"}
          </span>
        </div>

        {/* Title and Description */}
        <h2
          id={`post-title-${postId}`}
          className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight"
        >
          {title}
        </h2>
        <p className="text-sm text-gray-600 mb-5 line-clamp-3 leading-relaxed" aria-describedby="post-description">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 mb-5">
          <div className="flex items-center bg-gray-50 px-2.5 py-1.5 rounded-md">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" aria-hidden="true" />
            <span>{formattedDate}</span>
          </div>
          {(lat || lng) && (
            <div className="flex items-center bg-gray-50 px-2.5 py-1.5 rounded-md">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" aria-hidden="true" />
              <span>
                {lat && lng ? `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}` : "Location"}
              </span>
            </div>
          )}
        </div>

        {/* Media Section */}
        {media && media.length > 0 && (
          <div className="mb-5">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {media.map((src, i) => (
                <motion.img
                  key={i}
                  src={src}
                  alt={`Media ${i + 1} for ${title}`}
                  className="h-20 w-28 object-cover rounded-xl border border-gray-100 shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-2 pt-4 border-t border-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus-within:opacity-100">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Edit post"
              aria-label={`Edit post: ${title}`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-200"
              title="Delete post"
              aria-label={`Delete post: ${title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Status color utility
const statusColor = (status) => {
  if (!status) return "bg-gray-50 text-gray-700 border-gray-200";
  switch (status.toLowerCase()) {
    case "resolved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "under-investigation":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export default Postcard;