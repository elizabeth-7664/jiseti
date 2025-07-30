// src/pages/PostDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostDetail from "../components/post/PostDetail";
import EditPost from "../components/post/EditPost";
import Loader from "../components/shared/Loader";
import { getReport, updateReport, getReportMedia } from "../utils/api"; // <-- Import getReportMedia
import Button from "../components/ui/Button";
import { toast } from "sonner";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Function to load the post and its media
  const loadPostAndMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!id) {
        setError("No report ID provided in the URL.");
        setLoading(false);
        return;
      }
      console.log(`PostDetailPage: Attempting to call getReport with ID: ${id}`);

      // Fetch the report details
      const reportRes = await getReport(id);
      let reportData = reportRes.data;

      // Fetch the media separately
      console.log(`PostDetailPage: Attempting to call getReportMedia with ID: ${id}`);
      const mediaRes = await getReportMedia(id);
      const mediaData = mediaRes.data;

      // Combine report data with media data
      setPost({ ...reportData, media: mediaData }); // Merge media into the post object

    } catch (err) {
      console.error("PostDetailPage: Error loading post or media:", err);
      setError("Failed to load post details or media. Please try again.");
      toast.error("Failed to load post details.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle saving changes from EditPost
  const handleSave = async (updatedData) => {
    setIsSaving(true);
    try {
      console.log("Attempting to update report:", id, updatedData);
      const res = await updateReport(id, updatedData);
      // After saving, you might want to reload the post and media to get fresh data
      await loadPostAndMedia(); // Reload to ensure media is updated if it was changed via edit form
      setIsEditing(false);
      toast.success("Report updated successfully!");
    } catch (err) {
      console.error("Failed to update report:", err);
      setError("Failed to save changes.");
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadPostAndMedia(); // Call the new function
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => navigate(-1)} className="text-sm md:text-base">
            ← Back
          </Button>
          {post && !loading && !error && (
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className={`
                px-4 py-2 rounded-lg text-white font-medium
                ${isEditing ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-600 hover:bg-primary-700'}
                transition-colors duration-200
              `}
            >
              {isEditing ? "Exit Edit Mode" : "Edit Report"}
            </Button>
          )}
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-600 font-medium text-center py-8">{error}</div>
        ) : post ? (
          isEditing ? (
            <EditPost
              post={post}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
              isSaving={isSaving}
            />
          ) : (
            <PostDetail post={post} />
          )
        ) : (
          <p className="text-gray-500 text-center py-8">Report not found.</p>
        )}
      </div>
    </div>
  );
}