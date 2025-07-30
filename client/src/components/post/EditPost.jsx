// src/components/post/EditPost.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Input from "../ui/Input"; // Assuming these UI components exist
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import MapPicker from "./MapPicker"; // Map selection component
import PostMediaUploader from "./PostMediaUploader"; // Media upload component
import { toast } from "sonner"; // For notifications (consistent with previous discussions)
import { deleteReport } from "../../utils/api"; // Import the deleteReport API call

// Helper for status classes (can be moved to a shared utils file)
const getStatusClasses = (status) => {
  switch (status) {
    case "draft":
      return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200";
    case "under-investigation":
      return "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200";
    case "rejected":
      return "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200";
    case "resolved":
      return "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200";
    default:
      return "bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200";
  }
};

const EditPost = ({ post, onSave, onCancel, isSaving }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // State to hold form data, initialized with existing post data
  const [formData, setFormData] = useState({
    title: post.title || "",
    description: post.description || "",
    category: post.category || "red-flag", // Default if not set
    status: post.status || "draft", // Default if not set
    location: post.location || "", // Text-based location
    coordinates: // Object for map coordinates
      post.latitude && post.longitude
        ? { lat: post.latitude, lng: post.longitude }
        : null,
    media: post.media || [], // Array of media files/objects
  });

  // State for managing the delete operation's loading status
  const [isDeleting, setIsDeleting] = useState(false);

  // Effect to update formData if the 'post' prop changes (e.g., after initial fetch or a parent update)
  useEffect(() => {
    setFormData({
      title: post.title || "",
      description: post.description || "",
      category: post.category || "red-flag",
      status: post.status || "draft",
      location: post.location || "",
      coordinates:
        post.latitude && post.longitude
          ? { lat: post.latitude, lng: post.longitude }
          : null,
      media: post.media || [],
    });
  }, [post]);

  // Handler for changes in text inputs and select elements
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for location changes from the MapPicker component
  const handleLocationSelect = (coords) => {
    setFormData((prev) => ({ ...prev, coordinates: coords }));
  };

  // Handler for media changes from the PostMediaUploader component
  const handleMediaChange = (mediaFiles) => {
    setFormData((prev) => ({ ...prev, media: mediaFiles }));
  };

  // Handler for form submission (Save Changes)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving || isDeleting) return; // Prevent submission if already saving or deleting

    // Basic client-side validation
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Title and Description are required.");
      return;
    }

    // Prepare data payload to match backend API schema (e.g., FastAPI Pydantic models)
    const dataToSave = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      status: formData.status,
      location: formData.location.trim() === "" ? null : formData.location.trim(), // Send null if text location is empty
      latitude: formData.coordinates ? formData.coordinates.lat : null, // Extract latitude from coordinates
      longitude: formData.coordinates ? formData.coordinates.lng : null, // Extract longitude from coordinates
      media: formData.media, // Pass media array as is (assuming backend handles it)
    };

    // Call the onSave callback passed from PostDetailPage to handle the API update
    await onSave(dataToSave);
  };

  // Handler for deleting the report
  const handleDelete = async () => {
    if (isSaving || isDeleting) return; // Prevent deletion if already saving or deleting

    // Confirmation dialog before proceeding with deletion (CRITICAL for destructive actions)
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this report? This action cannot be undone."
    );

    if (confirmDelete) {
      setIsDeleting(true); // Set deleting state to true
      try {
        await deleteReport(post.id); // Call the delete API
        toast.success("Report deleted successfully!"); // Show success notification
        navigate("/posts"); // Redirect to the posts list page after successful deletion
      } catch (err) {
        console.error("Failed to delete report:", err); // Log error
        toast.error("Failed to delete report. Please try again."); // Show error notification
      } finally {
        setIsDeleting(false); // Reset deleting state
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Edit Report
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Report Title"
            required
            className="w-full"
          />
        </div>

        {/* Description Textarea */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of the report..."
            rows="5"
            required
            className="w-full"
          />
        </div>

        {/* Category and Status Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select // Using native select; replace with your custom Select component if available
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="red-flag">Red-Flag</option>
              <option value="intervention">Intervention</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select // Using native select; replace with your custom Select component if available
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="draft">Draft</option>
              <option value="under-investigation">Under Investigation</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Text Location Input */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specific Location (Text)</label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Moi Avenue, near City Market"
            className="w-full"
          />
        </div>

        {/* Map Picker for Coordinates */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Location on Map (Optional)</label>
          <MapPicker
            onLocationSelect={handleLocationSelect}
            initialCoordinates={formData.coordinates} // Pass existing coordinates to MapPicker
          />
          {formData.coordinates && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Selected: Lat {formData.coordinates.lat?.toFixed(4)}, Lng {formData.coordinates.lng?.toFixed(4)}
            </p>
          )}
        </div>

        {/* Media Uploader */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Upload Media (Optional)</label>
          <PostMediaUploader files={formData.media} onChange={handleMediaChange} />
        </div>

        {/* Action Buttons: Delete on left, Cancel/Save on right */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            onClick={handleDelete}
            // Add explicit styling for danger button
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            disabled={isSaving || isDeleting} // Disable if saving or deleting
          >
            {isDeleting ? "Deleting..." : "Delete Report"}
          </Button>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving || isDeleting} // Disable if saving or deleting
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || isDeleting} // Disable if saving or deleting
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPost;