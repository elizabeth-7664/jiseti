// src/components/post/LocationPicker.jsx
import React from "react";

const LocationPicker = ({ location, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Location</label>
      <input
        type="text"
        value={location}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter location"
        className="border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
      />
    </div>
  );
};

export default LocationPicker;
