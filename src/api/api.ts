import axios from "axios";
// Dynamic base URL based on current hostname
const hostname = window.location.hostname; // e.g., "customer1.bondify.uz"
const BASE_URL = `https://${hostname}/api`;

export const api = axios.create({
    baseURL: BASE_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
            
            window.location.replace('/login');
        }
        return Promise.reject(error);
    }
);



