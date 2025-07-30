// src/components/post/RecordForm.jsx
import React, { useState } from "react";
import MapPicker from "./MapPicker";
import PostMediaUploader from "./PostMediaUploader";
import { createReport } from "../../utils/api";
import { toast } from "sonner"; // optional toast lib

// --- CRITICAL FIX: Ensure initialForm is defined and not commented out ---
const initialForm = {
  title: "",
  description: "",
  category: "red-flag", // or "intervention"
  location: "", // Text input for location
  coordinates: null, // Still for map picker (latitude, longitude)
  media: [],
};
// --- END CRITICAL FIX ---

// Assuming you chose Option 1 from last time: change RecordForm to expect onSuccess
const RecordForm = ({ onSuccess }) => { // Assuming onSuccess is the prop name
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

    if (!formData.coordinates && !formData.location.trim()) {
        return toast.error("Please provide a location (either on map or as text).");
    }

    try {
      setSubmitting(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location.trim() === "" ? null : formData.location.trim(),
        latitude: formData.coordinates ? formData.coordinates.lat : null,
        longitude: formData.coordinates ? formData.coordinates.lng : null,
        media: formData.media,
      };

      const response = await createReport(payload);
      onSuccess(response.data); // Call onSuccess with response.data
      toast.success("Report submitted");
      setFormData(initialForm); // Reset form
    } catch (err) {
      toast.error("Failed to submit report");
      console.error("Submission error:", err);
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