// src/components/post/AddPost.jsx
import React, { useState } from "react";
import Modal from "../ui/Modal";
import RecordForm from "./RecordForm";

// Add onPostAdded to the destructured props
export default function AddPost({ onPostAdded }) { // <--- ADDED onPostAdded here
  const [isOpen, setIsOpen] = useState(false);

  // handleSuccess will still call onPostAdded, but it's now passed down
  const handleSuccess = (newPost) => {
    onPostAdded(newPost); // This now correctly calls the prop received by AddPost
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl"
      >
        + New Report
      </button>

      {/* Pass onPostAdded directly to RecordForm */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <RecordForm mode="create" onPostAdded={handleSuccess} /> {/* <--- CHANGED TO onPostAdded */}
      </Modal>
    </>
  );
}