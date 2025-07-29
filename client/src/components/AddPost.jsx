// src/components/AddPost.jsx
import React, { useState } from "react";
import { createReport } from "../utils/api"; // Corrected import

export const AddPost = ({ isOpen, onClose, onPostAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [category, setCategory] = useState("bribery"); // Default value
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const reportData = {
        title,
        description,
        location: location || undefined, // Optional, send undefined if empty
        latitude: latitude ? parseFloat(latitude) : undefined, // Convert to float if provided
        longitude: longitude ? parseFloat(longitude) : undefined, // Convert to float if provided
        category,
      };
      const response = await createReport(reportData);
      onPostAdded(response.data); // Pass the created report to parent
      setTitle("");
      setDescription("");
      setLocation("");
      setLatitude("");
      setLongitude("");
      setCategory("bribery");
      onClose();
    } catch (err) {
      console.error("Error adding post:", err);
      setError(
        err.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Failed to add post. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">New Post</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-3">
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              placeholder="e.g. Corruption at Road Project"
              className="border p-2 w-full mb-3 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              placeholder="e.g. Bribes were requested at checkpoint X."
              className="border p-2 w-full mb-3 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Location (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Nairobi"
              className="border p-2 w-full mb-3 rounded"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Latitude (Optional)</label>
              <input
                type="number"
                step="0.0001"
                placeholder="e.g. -1.2921"
                className="border p-2 w-full mb-3 rounded"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1">Longitude (Optional)</label>
              <input
                type="number"
                step="0.0001"
                placeholder="e.g. 36.8219"
                className="border p-2 w-full mb-3 rounded"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block mb-1">Category</label>
            <select
              className="border p-2 w-full mb-3 rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="bribery">Bribery</option>
              <option value="corruption">Corruption</option>
              <option value="fraud">Fraud</option>
              {/* Add more categories as needed */}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};