import axios from "axios";

export const BASE_URL = "https://ecommerse-shoppit.onrender.com";

const api = axios.create({
    baseURL: BASE_URL,
});

// ✅ Attach JWT Token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Handle Token Expiry & Auto-Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refresh");
                if (!refreshToken) throw new Error("No refresh token available.");

                const { data } = await axios.post(`${BASE_URL}api/token/refresh/`, { refresh: refreshToken });

                localStorage.setItem("access", data.access);
                api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.error("❌ Token refresh failed:", refreshError);
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
