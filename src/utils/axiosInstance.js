import axios from "axios";
import { store } from "../redux/store";
import { signOutSuccess } from "../redux/slice/userSlice";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Ensure this is correctly set in .env
  withCredentials: true, // For cookies if backend uses them
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from Redux state to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user.currentUser?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response?.status === 401) {
      // Clear user from Redux and localStorage
      store.dispatch(signOutSuccess());
      localStorage.removeItem("currentUser");

      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
