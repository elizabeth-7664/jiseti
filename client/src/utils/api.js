import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";


const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});


api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ---------------------------------------------
// ✅ AUTH
// ---------------------------------------------
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
export const resetPassword = (data) => api.post("/auth/reset-password", data);
export const checkDb = () => api.get("/auth/check-db");

// ---------------------------------------------
// ✅ REPORTS
// ---------------------------------------------
export const getReports = () => api.get("/reports/");
export const getReport = (id) => api.get(`/reports/${id}`);
export const createReport = (data) => api.post("/reports/", data);
export const updateReport = (id, data) => api.put(`/reports/${id}`, data);
export const deleteReport = (id) => api.delete(`/reports/${id}`);
export const updateReportLocation = (id, data) => api.patch(`/reports/${id}/location`, data);

// ---------------------------------------------
// ✅ MEDIA
// ---------------------------------------------
export const uploadMedia = (formData) =>
  api.post("/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteMedia = (mediaId) => api.delete(`/media/${mediaId}`);
export const getReportMedia = (reportId) => api.get(`/media/report/${reportId}`);

// ---------------------------------------------
// ✅ COMMENTS
// ---------------------------------------------
export const postComment = (reportId, data) => api.post(`/comments/${reportId}`, data);
export const getComments = (reportId) => api.get(`/comments/${reportId}`);

// ---------------------------------------------
// ✅ NOTIFICATIONS
// ---------------------------------------------
export const createNotification = (data) => api.post("/notifications/", data);
export const getUserNotifications = (userId) => api.get(`/notifications/user/${userId}`);

// ---------------------------------------------
// ✅ ADMIN
// ---------------------------------------------
export const getUsers = () => api.get("/admin/users");
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);
export const updateReportStatus = (reportId, statusData) =>
  api.patch(`/admin/reports/${reportId}/status`, statusData);

// ---------------------------------------------
// ✅ GENERIC UTILS (Optional for flexibility)
// ---------------------------------------------
export const get = (url, config = {}) => api.get(url, config);
export const post = (url, data, config = {}) => api.post(url, data, config);
export const put = (url, data, config = {}) => api.put(url, data, config);
export const del = (url, config = {}) => api.delete(url, config);


export default api;
