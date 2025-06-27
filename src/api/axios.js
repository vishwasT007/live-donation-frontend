import axios from "axios";

// Use env variable or fallback to localhost in dev
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default axiosInstance;
