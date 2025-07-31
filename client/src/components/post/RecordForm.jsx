// src/components/post/RecordForm.jsx
import React, { useState, useEffect } from "react";
import MapPicker from "./MapPicker"; // Assuming MapPicker exists
import PostMediaUploader from "./PostMediaUploader"; // Assuming PostMediaUploader exists
import { createReport } from "../../utils/api";
import { toast } from "sonner";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

const initialForm = {
  title: "",
  description: "",
  category: "red-flag",
  location: "",
  coordinates: null,
  media: [],
};

const RecordForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  // Debugging: Log prop types
  useEffect(() => {
    console.log("RecordForm rendered. onSuccess prop type:", typeof onSuccess);
    if (typeof onSuccess !== "function") {
      console.error("RecordForm: onSuccess prop is NOT a function!", onSuccess);
    }
    console.log("RecordForm rendered. onCancel prop type:", typeof onCancel);
  }, [onSuccess, onCancel]);

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
      toast.error("Please provide a location (either on map or as text).");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location.trim() || null,
        latitude: formData.coordinates ? formData.coordinates.lat : null,
        longitude: formData.coordinates ? formData.coordinates.lng : null,
        media: formData.media,
      };
      const response = await createReport(payload);
      if (typeof onSuccess === "function") {
        onSuccess(response.data);
      } else {
        console.error("RecordForm: onSuccess is not a function!", onSuccess);
        toast.error("Form submitted, but callback failed. Check console.");
      }
      toast.success("Report submitted successfully!");
      setFormData(initialForm);
    } catch (err) {
      toast.error("Failed to submit report. Please try again.");
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-10 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 max-w-4xl mx-auto transition-all duration-300"
      aria-label="Submit a new report"
    >
      <h2 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-10 tracking-tight">
        Submit a New Report
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 mb-10">
        {/* Left Column */}
        <div className="space-y-8">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
            >
              Report Type
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-colors duration-200 appearance-none pr-12"
                aria-describedby="category-description"
              >
                <option value="red-flag">Red Flag</option>
                <option value="intervention">Intervention</option>
              </select>
              <svg
                className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p id="category-description" className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Select the type of report you are submitting.
            </p>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
            >
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Illegal dumping in river"
              className="px-5 py-3 rounded-xl text-base focus:ring-blue-500"
              aria-required="true"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
            >
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={10}
              placeholder="Provide detailed information about the incident..."
              className="px-5 py-3 rounded-xl text-base focus:ring-blue-500"
              aria-required="true"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
            >
              Specific Location (e.g., street, landmark)
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Moi Avenue, near City Market"
              className="px-5 py-3 rounded-xl text-base focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Select Location on Map
            </label>
            <MapPicker onLocationSelect={handleLocationSelect} />
            {formData.coordinates && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                Selected: Lat {formData.coordinates.lat.toFixed(4)}, Lng{" "}
                {formData.coordinates.lng.toFixed(4)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Upload Media
            </label>
            <PostMediaUploader onUpload={handleMediaUpload} />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-end border-t border-gray-200/50 dark:border-gray-800/50 mt-10">
        <Button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto px-10 py-3.5 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200"
          size="lg"
        >
          {submitting ? <Spinner /> : "Submit Report"}
        </Button>
        {typeof onCancel === "function" && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
            className="w-full sm:w-auto px-10 py-3.5 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-200"
            size="lg"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default RecordForm;