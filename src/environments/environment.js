import axios from "axios";

console.log("API URL:", process.env.REACT_APP_BASE_URL); // Verificar no console

export const http = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);
