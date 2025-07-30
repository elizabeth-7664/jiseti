import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import LocationPicker from "./LocationPicker";
import PostMediaUploader from "./PostMediaUploader";

import { getReport, updateReport } from "../../utils/api";
import { toast } from "react-toastify"; // <-- Use react-toastify's toast

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "red-flag",
    media: [],
    location: { lat: null, lng: null },
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getReport(id);
        const data = res.data;
        setPost(data);
        setFormData({
          title: data.title,
          description: data.description,
          type: data.type,
          media: data.media || [],
          location: data.location || { lat: null, lng: null },
        });
      } catch (err) {
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (coords) => {
    setFormData((prev) => ({ ...prev, location: coords }));
  };

  const handleMediaChange = (media) => {
    setFormData((prev) => ({ ...prev, media }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateReport(id, formData);
      toast.success("Post updated successfully");
      navigate(`/posts/${id}`);
    } catch (err) {
      toast.error("Failed to update post");
    }
  };

  if (loading) return <p className="text-center">Loading post...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-background rounded-lg p-6 shadow">
      <h2 className="text-2xl font-semibold mb-4 text-foreground">Edit Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title of your report"
          required
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed description of the issue"
          rows={6}
          required
        />

        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="red-flag">Red Flag</option>
            <option value="intervention">Intervention</option>
          </select>
        </div>

        <LocationPicker value={formData.location} onChange={handleLocationChange} />

        <PostMediaUploader files={formData.media} onChange={handleMediaChange} />

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default EditPost;
