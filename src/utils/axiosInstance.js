import axios from "axios";
import { store } from "../redux/store"; // access redux store for token if needed

// Change this to your deployed backend URL
const BASE_URL = "https://travel-story-backend-qxz0.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // keep this if using cookies for auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token if your backend uses JWT
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user.currentUser?.token; // token must be sent by backend
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // auto sign out user
      store.dispatch({ type: "user/signOutSuccess" });
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
