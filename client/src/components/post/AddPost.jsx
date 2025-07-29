// src/components/post/AddPost.jsx
import React, { useState } from "react";
import Modal from "../ui/Modal";
import RecordForm from "./RecordForm";

export default function AddPost({ onPostAdded }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = (newPost) => {
    onPostAdded(newPost);
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <RecordForm mode="create" onSuccess={handleSuccess} />
      </Modal>
    </>
  );
}
