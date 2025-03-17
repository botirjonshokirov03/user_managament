import axios from "axios";

// ✅ Use environment variable for API base URL
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Centralized error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ✅ API Methods (Reusability & Clean Code)
export const fetchUsers = () => api.get("/users");
export const blockUsers = (userIds) =>
  api.post("/users/block", { user_ids: userIds });
export const unblockUsers = (userIds) =>
  api.post("/users/unblock", { user_ids: userIds });
export const deleteUsers = (userIds) =>
  api.post("/users/delete", { user_ids: userIds });
export const loginUser = (credentials) => api.post("/auth/login", credentials);
export const registerUser = (userData) => api.post("/auth/register", userData);

export default api;
