import axios from "axios";
import { store } from "../redux/store";

// Use environment variable
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // keep if using cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if present
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

// Handle unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch({ type: "user/signOutSuccess" });
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
