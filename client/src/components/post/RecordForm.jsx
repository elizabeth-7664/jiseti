import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, FileText, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import MapPicker from "./MapPicker";
import PostMediaUploader from "./PostMediaUploader";
import { createReport } from "../../utils/api";
import { toast } from "sonner";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

const initialForm = {
  title: "",
  description: "",
  category: "red-flag",
  location: "",
  coordinates: null,
  media: [],
};

const steps = [
  { id: 1, title: "Basic Info", icon: FileText },
  { id: 2, title: "Location", icon: MapPin },
  { id: 3, title: "Review", icon: CheckCircle2 },
];

const RecordForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaUpload = (mediaFiles) => {
    setFormData((prev) => ({ ...prev, media: mediaFiles }));
  };

  const handleLocationSelect = (coords) => {
    setFormData((prev) => ({ ...prev, coordinates: coords }));
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.title.trim()) {
        toast.error("Please enter a title.");
        return false;
      }
      if (!formData.description.trim()) {
        toast.error("Please enter a description.");
        return false;
      }
    } else if (step === 2) {
      if (!formData.coordinates && !formData.location.trim()) {
        toast.error("Please provide a location (either on map or as text).");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) return;

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location.trim() || null,
        latitude: formData.coordinates ? formData.coordinates.lat : null,
        longitude: formData.coordinates ? formData.coordinates.lng : null,
        media: formData.media,
      };
      const response = await createReport(payload);
      if (typeof onSuccess === "function") {
        onSuccess(response.data);
      }
      toast.success("Report submitted successfully!");
      setFormData(initialForm);
      setCurrentStep(1);
    } catch (err) {
      toast.error("Failed to submit report. Please try again.");
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Report Type
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all"
                >
                  <option value="red-flag">Red Flag</option>
                  <option value="intervention">Intervention</option>
                </select>
                <svg
                  className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Illegal dumping in river"
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Provide detailed information about the incident..."
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Specific Location (Text)
              </label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Moi Avenue, near City Market"
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Select on Map
              </label>
              <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                <MapPicker onLocationSelect={handleLocationSelect} />
              </div>
              {formData.coordinates && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Location selected
                </p>
              )}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Evidence / Media
              </label>
              <PostMediaUploader onUpload={handleMediaUpload} />
            </div>

            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                Review Your Report
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Type:</span>
                  <span className="text-gray-900 dark:text-gray-100 capitalize">
                    {formData.category.replace("-", " ")}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Title:</span>
                  <span className="text-gray-900 dark:text-gray-100">{formData.title}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Desc:</span>
                  <span className="text-gray-900 dark:text-gray-100 line-clamp-2">{formData.description}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Location:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formData.location || "Map coordinates selected"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Media:</span>
                  <span className="text-gray-900 dark:text-gray-100">{formData.media.length} files attached</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 md:p-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 max-w-4xl mx-auto transition-all duration-300">
      <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-8 tracking-tight">
        Submit a New Report
      </h2>

      {/* Progress Indicator */}
      <div className="mb-10 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 rounded-full overflow-hidden z-0">
          <motion.div 
            className="h-full bg-blue-600"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="relative z-10 flex justify-between">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.id;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
                    isActive
                      ? "bg-blue-600 border-white dark:border-gray-900 text-white shadow-md"
                      : "bg-gray-200 dark:bg-gray-700 border-white dark:border-gray-900 text-gray-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`mt-2 text-xs font-semibold ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-4 pt-8 justify-between border-t border-gray-200/50 dark:border-gray-800/50 mt-10">
          <div className="flex gap-4 w-full sm:w-auto">
            {typeof onCancel === "function" && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-2.5 font-semibold"
              >
                Cancel
              </Button>
            )}
          </div>
          
          <div className="flex gap-4 w-full sm:w-auto">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-2.5 font-semibold flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
            )}
            
            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto px-8 py-2.5 font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-2.5 font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                {submitting ? <Spinner /> : "Submit Report"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default RecordForm;