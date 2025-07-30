// src/utils/utils.js
// Format a date (e.g., for displaying post/report timestamps)
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Capitalize the first letter of a string
export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Check if user is admin
export function isAdmin(user) {
  return user?.role === "admin";
}

// Convert file to base64 (e.g., for uploads)
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
