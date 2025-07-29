// src/components/RecordForm.jsx
import { useState } from "react";
import PostMediaUploader from "./PostMediaUploader";

export default function RecordForm({ onRecordAdded }) {
  const [form, setForm] = useState({
    title: "",
    type: "red-flag",
    urgency: "low",
    lat: "",
    lng: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit new record:", form);
    onRecordAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4 border p-4 rounded shadow">
      <h2 className="text-lg font-semibold">Create New Record</h2>
      <input name="title" placeholder="Title" required className="w-full border p-2" onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <select name="type" className="w-full border p-2" onChange={(e) => setForm({ ...form, type: e.target.value })}>
        <option value="red-flag">Red Flag</option>
        <option value="intervention">Intervention</option>
      </select>
      <select name="urgency" className="w-full border p-2" onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <div className="flex gap-4">
        <input name="lat" placeholder="Latitude" required className="w-1/2 border p-2" onChange={(e) => setForm({ ...form, lat: e.target.value })} />
        <input name="lng" placeholder="Longitude" required className="w-1/2 border p-2" onChange={(e) => setForm({ ...form, lng: e.target.value })} />
      </div>
      <PostMediaUploader />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Submit</button>
    </form>
  );
}
