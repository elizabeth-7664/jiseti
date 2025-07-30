// src/components/post/PostMediaUploader.jsx
import React, { useState, useRef, useCallback } from "react";
import imageCompression from "browser-image-compression";

const MAX_FILES = 4;

const PostMediaUploader = ({ onUpload }) => {
  const [files, setFiles] = useState([]);
  const dropRef = useRef();

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (err) {
      console.error("Compression error:", err);
      return file;
    }
  };

  const processFiles = async (incoming) => {
    let incomingFiles = Array.from(incoming).slice(0, MAX_FILES - files.length);

    const processed = await Promise.all(
      incomingFiles.map(async (file) => {
        const isImage = file.type.startsWith("image");
        const finalFile = isImage ? await compressImage(file) : file;

        return {
          file: finalFile,
          preview: URL.createObjectURL(finalFile),
          type: isImage ? "image" : "video",
        };
      })
    );

    const updatedFiles = [...files, ...processed];
    setFiles(updatedFiles);
    onUpload(updatedFiles.map((f) => f.file));
  };

  const handleFileInput = (e) => processFiles(e.target.files);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      processFiles(e.dataTransfer.files);
      dropRef.current.classList.remove("border-blue-500");
    },
    [files]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add("border-blue-500");
  };

  const handleDragLeave = () => {
    dropRef.current.classList.remove("border-blue-500");
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onUpload(updatedFiles.map((f) => f.file));
  };

  return (
    <div>
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="mb-4 border-2 border-dashed border-gray-300 p-4 rounded-lg text-center text-sm text-gray-500 hover:border-blue-500 transition-all"
      >
        Drag & drop media here or click below
      </div>

      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileInput}
        className="mb-3 block"
      />

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {files.map((f, idx) => (
            <div key={idx} className="relative">
              {f.type === "image" ? (
                <img
                  src={f.preview}
                  alt="preview"
                  className="rounded w-full h-32 object-cover"
                />
              ) : (
                <video
                  src={f.preview}
                  controls
                  className="rounded w-full h-32 object-cover"
                />
              )}
              <button
                onClick={() => removeFile(idx)}
                type="button"
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostMediaUploader;
