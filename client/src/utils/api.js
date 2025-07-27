import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

API.interceptors.request.use((req) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.access_token) {
        req.headers.Authorization = `Bearer ${user.access_token}`;
    }
    return req;
});

export const fetchCurrentUser = () => API.get('/api/users/me');

export const fetchReports = () => API.get('/api/reports'); // Adjust endpoint to match your backend

export const createReport = (data) => API.post('api//reports', data);

export const fetchComments = (reportId) => API.get(`/api/comments/${reportId}`);

export const createComment = (reportId, data) => API.post(`/api/comments/${reportId}`, data);

export default API;