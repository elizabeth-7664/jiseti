// src/pages/CreatePostPage.jsx
import React from "react";
import RecordForm from "../components/post/RecordForm";
import { useNavigate } from "react-router-dom";

export default function CreatePostPage() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleReportSubmitted = (newReport) => {
    navigate(`/reports/${newReport.id}`); // Navigate to the detail view of the new report
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 md:px-8 lg:px-16 xl:px-24 md:py-12 text-gray-900 dark:text-white flex justify-center items-start">
      {/* Adjusted max-w for better scaling on large screens */}
      <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Create a New Report</h2>
        <RecordForm onSuccess={handleReportSubmitted} onCancel={handleCancel} />
      </div>
    </div>
  );
}
