// src/components/PostMediaUploader.jsx
export default function PostMediaUploader() {
  return (
    <div className="border p-2 rounded">
      <label className="block mb-2 font-medium">Upload Images or Videos</label>
      <input type="file" accept="image/*,video/*" multiple />
    </div>
  );
}
