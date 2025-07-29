// src/components/post/RecordForm.jsx
import React, { useState } from "react";
import MapPicker from "./MapPicker";
import PostMediaUploader from "./PostMediaUploader";
import { createReport } from "../../utils/api";
import { toast } from "sonner"; // optional toast lib

const initialForm = {
  title: "",
  description: "",
  type: "red-flag", // or "intervention"
  coordinates: null,
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
    if (!formData.coordinates) return toast.error("Please select a location");
    try {
      setSubmitting(true);
      const response = await createReport(formData);
      onPostAdded(response);
      toast.success("Report submitted");
      setFormData(initialForm);
    } catch (err) {
      toast.error("Failed to submit report");
      console.error(err);
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
          name="type"
          value={formData.type}
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
        <label className="block text-sm font-medium mb-2">Select Location</label>
        <MapPicker onLocationSelect={handleLocationSelect} />
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
