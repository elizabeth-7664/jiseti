// src/components/post/PostDetail.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { formatDate } from '../../utils/utils'; // Import your formatDate utility

// Fix for default Leaflet icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const PostDetail = ({ post }) => {
  if (!post) {
    return <div className="text-center text-gray-500 dark:text-gray-400">No post data available.</div>;
  }

  const createdDate = post.created_at ? formatDate(post.created_at) : 'N/A';
  const lastUpdatedDate = post.updated_at ? formatDate(post.updated_at) : 'N/A';

  const categoryClasses = {
    'red-flag': 'bg-red-500',
    'intervention': 'bg-blue-500',
  };

  const statusClasses = {
    'draft': 'bg-gray-400',
    'under-investigation': 'bg-yellow-500',
    'resolved': 'bg-green-500',
    'rejected': 'bg-red-500',
  };

  const hasCoordinates = post.latitude != null && post.longitude != null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-3xl">
      <div className="flex justify-between items-start mb-6">
        <span className={`text-sm font-semibold px-3 py-1 rounded-full text-white ${categoryClasses[post.category] || 'bg-gray-500'}`}>
          {post.category.replace('-', ' ').toUpperCase()}
        </span>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full text-white ${statusClasses[post.status] || 'bg-gray-500'}`}>
          {post.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">{post.title}</h1>

      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex flex-wrap gap-x-4">
        <span>Created: {createdDate}</span>
        <span>Last Updated: {lastUpdatedDate}</span>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Description</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{post.description}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Location</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{post.location || 'Location not specified.'}</p>
        {hasCoordinates && (
          <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700" style={{ height: '300px', width: '100%' }}>
            <MapContainer center={[post.latitude, post.longitude]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[post.latitude, post.longitude]}>
                <Popup>
                  {post.location || 'Report Location'}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>

      {/* NEW: Media Section - Adjustments made here */}
      {post.media && post.media.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Media</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {post.media.map((mediaItem, index) => (
              <div key={index} className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md">
                {/* Use mediaItem.file_type and mediaItem.file_url */}
                {mediaItem.file_type && mediaItem.file_type.startsWith('image/') ? (
                  <img
                    src={mediaItem.file_url} // Changed from .url to .file_url
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : mediaItem.file_type && mediaItem.file_type.startsWith('video/') ? (
                  <video
                    src={mediaItem.file_url} // Changed from .url to .file_url
                    controls
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-600 dark:text-gray-300 text-sm">
                    Unsupported Media Type
                    <a href={mediaItem.file_url} target="_blank" rel="noopener noreferrer" className="ml-1 text-primary-500 hover:underline">Download</a>
                  </div>
                )}
                {/* Optional: Display filename or other info - assuming 'filename' might still come from upload,
                    if not, you might need to use `file_url` and parse it or add a 'filename' to MediaOut schema */}
                {mediaItem.filename && ( // If 'filename' is not in MediaOut, this won't show
                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-tr-lg">
                        {mediaItem.filename}
                    </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Comments</h2>
        <p className="text-gray-600 dark:text-gray-400">No comments yet. Be the first to comment!</p>
      </div>
    </div>
  );
};

export default PostDetail;