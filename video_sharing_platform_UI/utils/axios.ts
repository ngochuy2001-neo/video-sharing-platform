import axios from "axios";

const api = axios.create({
  baseURL: "http://http://192.168.10.83/",
  // withCredentials: true, // nếu cần gửi cookie
});

// Thêm interceptor để tự động đính kèm token vào header Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api; 