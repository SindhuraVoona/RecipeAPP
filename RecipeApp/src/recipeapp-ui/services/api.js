import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5272/api";

console.log("API Base URL:", baseURL);

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});


// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: global response handling (e.g. auto-logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // remove token and redirect to login
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("authChanged"));
      // use relative client route (adjust if your router base differs)
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;