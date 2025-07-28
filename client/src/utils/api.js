// src/utils/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // Change this to match your backend API base URL
  withCredentials: true, // Optional: if you're using cookies/sessions
});

export default API;
