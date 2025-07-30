// src/components/post/RecordForm.jsx
import React, { useState } from "react";
import MapPicker from "./MapPicker";
import PostMediaUploader from "./PostMediaUploader";
import { createReport } from "../../utils/api";
import { toast } from "sonner"; // optional toast lib

const initialForm = {
  title: "",
  description: "",
  category: "red-flag", // or "intervention"
  location: "", // <-- ADDED: Text input for location
  coordinates: null, // Still for map picker (latitude, longitude)
  media: [],
};

const RecordForm = ({ onPostAdded }) => {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaUpload = (mediaFiles) => {
    setFormData((prev) => ({ ...prev, media: mediaFiles }));
  };

  const handleLocationSelect = (coords) => {
    setFormData((prev) => ({ ...prev, coordinates: coords }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Decide if location text is mandatory if coordinates are not selected.
    // Given your backend error, `location` (text) must not be null if DB column is NOT NULL.
    // If you made the DB column nullable, then you can allow it to be empty string or null.
    // For now, let's make sure it's at least an empty string if not filled.

    if (!formData.coordinates && !formData.location.trim()) {
        // If both map coordinates AND text location are missing
        // This check depends on your backend's nullable configuration for location.
        // If `location` in DB is NOT NULL, you might want to enforce it here.
        // If DB `location` is nullable, an empty string is fine.
        return toast.error("Please provide a location (either on map or as text).");
    }


    try {
      setSubmitting(true);

      // Construct the payload for the backend
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location.trim() === "" ? null : formData.location.trim(), // Send null if empty string, otherwise trim it
        latitude: formData.coordinates ? formData.coordinates.lat : null,
        longitude: formData.coordinates ? formData.coordinates.lng : null,
        media: formData.media,
      };

      const response = await createReport(payload); // Send the constructed payload
      onPostAdded(response);
      toast.success("Report submitted");
      setFormData(initialForm);
    } catch (err) {
      toast.error("Failed to submit report");
      console.error("Submission error:", err); // Log the full error for debugging
      // console.error("Error response:", err.response?.data); // Log backend error response
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold">Submit a Report</h2>

      <div>
        <label className="block text-sm font-medium">Report Type</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="red-flag">Red Flag</option>
          <option value="intervention">Intervention</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
          placeholder="Corruption incident title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
          rows={4}
          placeholder="Describe the incident..."
        />
      </div>

      {/* ADDED: Text input for location */}
      <div>
        <label className="block text-sm font-medium">Specific Location (e.g., street, landmark)</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="e.g., Moi Avenue, near City Market"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Select Location on Map</label>
        <MapPicker onLocationSelect={handleLocationSelect} />
        {formData.coordinates && (
          <p className="text-sm text-gray-600 mt-1">
            Selected: Lat {formData.coordinates.lat.toFixed(4)}, Lng {formData.coordinates.lng.toFixed(4)}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Upload Media</label>
        <PostMediaUploader onUpload={handleMediaUpload} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
};

export default RecordForm;