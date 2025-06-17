import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/onboarding-type";

axios.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getOnboardingTypes = async () => {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
};

