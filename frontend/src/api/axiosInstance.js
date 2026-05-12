import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_APP_API_URL_LOCAL,
  // baseURL: import.meta.env.VITE_APP_API_URL_VERCEL,
  // baseURL: import.meta.env.VITE_APP_API_URL_AWS,
  baseURL: "/api",
  withCredentials: true,
});

export default axiosInstance;
