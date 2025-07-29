// src/services/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

// Attach Bearer token if available
API.interceptors.request.use(
  (req) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.access_token) {
      req.headers.Authorization = `Bearer ${user.access_token}`;
      console.log("Attached token from localStorage:", user.access_token); // Debug
    } else {
      console.warn("No access token found in localStorage");
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// ================== AUTH ==================
export const register = (data) => API.post("/api/auth/register", data);
export const login = (data) =>
  API.post("/auth/login", data, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
export const verifyEmail = (token) =>
  API.get(`/api/auth/verify-email?token=${token}`);
export const fetchCurrentUser = () =>
  API.get("/users/me").catch((err) => {
    if (err.response?.status === 404) {
      console.warn("Endpoint /users/me not available, using fallback");
      return Promise.resolve({ data: { id: null, full_name: "Guest" } });
    }
    throw err;
  });

// ================== REPORTS ==================
export const createReport = (data) => API.post("/create-report", data);
export const fetchReports = () => API.get("/api/get-reports");
export const fetchReportById = (id) => API.get(`/report/${id}`);
export const updateReportStatus = (id, status) =>
  API.patch(`/report/${id}/status`, { status });

// ================== USERS (ADMIN) ==================
export const fetchAllUsers = () => API.get("/admin/users");
export const deleteUser = (userId) => API.delete(`/admin/users/${userId}`);

// ================== USER RECORDS ==================
export const getUserRecords = (userId) =>
  API.get(`/users/${userId}`).catch((err) => {
    if (err.response?.status === 404) {
      console.warn("Endpoint /users/:id not available");
      return Promise.resolve({ data: [] });
    }
    throw err;
  });

// ================== COMMENTS ==================
export const fetchComments = (reportId) => API.get(`/comments/${reportId}`);
export const createComment = (reportId, data) =>
  API.post(`/comments/${reportId}`, data);

// ================== NOTIFICATIONS ==================
export const createNotification = (data) => API.post("/notifications/", data);
export const fetchUserNotifications = (userId) =>
  API.get(`/notifications/user/${userId}`);

// ================== MEDIA ==================
export const uploadMedia = (formData) =>
  API.post("/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export default API;