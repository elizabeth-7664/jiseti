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

export default API;