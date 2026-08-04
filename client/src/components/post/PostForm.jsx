// src/components/post/PostForm.jsx
import React, { useState } from "react";
import  Button  from "../ui/Button";
import  Input  from "../ui/Input";
import  Textarea  from "../ui/Textarea";
import PostMediaUploader from "./PostMediaUploader";
import MapPicker from "./MapPicker";

const PostForm = ({ initialData = {}, onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [type, setType] = useState(initialData.type || "red-flag");
  const [media, setMedia] = useState(initialData.media || []);
  const [location, setLocation] = useState(initialData.location || null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, type, media, location });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      
      <div className="space-x-2">
        <label className="text-sm font-medium">Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded">
          <option value="red-flag">Red-Flag</option>
          <option value="intervention">Intervention</option>
        </select>
      </div>

      <PostMediaUploader media={media} setMedia={setMedia} />
      <MapPicker location={location} setLocation={setLocation} />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Report"}
      </Button>
    </form>
  );
};

export default PostForm;
