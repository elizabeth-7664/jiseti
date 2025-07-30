import React from "react";
import { motion } from "framer-motion"; // For animations
import { MapPin, Calendar } from "lucide-react"; // For icons

const Postcard = ({ post, onEdit, onDelete }) => {
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

  // Animation variants for the card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    hover: { scale: 1.02, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" },
  };

  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-4 border border-gray-100 hover:border-accent transition-all duration-300"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      role="article"
      aria-labelledby={`post-title-${title}`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-bold uppercase text-primary tracking-wide">
          {type === "red-flag" ? "Red Flag" : "Intervention"}
        </span>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor(status)} shadow-sm`}
          aria-label={`Status: ${status}`}
        >
          {status.replace("-", " ")}
        </span>
      </div>

      {/* Title and Description */}
      <h2
        id={`post-title-${title}`}
        className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2"
      >
        {title}
      </h2>
      <p className="text-sm text-gray-600 mb-4 line-clamp-3" aria-describedby="post-description">
        {description}
      </p>

      {/* Geolocation and Date */}
      {(lat || lng) && (
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-1 text-accent" aria-hidden="true" />
          <span>
            {lat && lng ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : "Location not specified"}
          </span>
        </div>
      )}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Calendar className="w-4 h-4 mr-1 text-accent" aria-hidden="true" />
        <span>{new Date(created_at).toLocaleDateString()}</span>
      </div>

      {/* Media Section */}
      {media.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Media</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-accent scrollbar-track-gray-100">
            {media.map((src, i) => (
              <motion.img
                key={i}
                src={src}
                alt={`Media ${i + 1} for ${title}`}
                className="h-24 w-24 object-cover rounded-md border border-gray-200"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <motion.button
          onClick={onEdit}
          className="flex items-center text-sm font-medium text-accent hover:text-secondary transition-colors duration-200"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Edit post: ${title}`}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Edit
        </motion.button>
        <motion.button
          onClick={onDelete}
          className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors duration-200"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Delete post: ${title}`}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Delete
        </motion.button>
      </div>

      {/* Decorative Element */}
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-accent" />
    </div>
  );
};

// Status color utility
const statusColor = (status) => {
  switch (status) {
    case "resolved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "under-investigation":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default Postcard;