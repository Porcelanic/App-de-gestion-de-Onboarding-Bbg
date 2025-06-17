import axios from "axios";
import {CreateOnboardingData} from "../types/createOnboardingData";
import {UpdateOnboardingData} from "../types/updateOnboardingData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/onboarding";

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

export const createOnboarding = async (data: CreateOnboardingData) => {
    console.log("Creating onboarding with data:", data);
    const response = await axios.post(`${API_BASE_URL}`, data);
    return response.data;       
};

export const updateOnboarding = async (onboardingId: number, data: UpdateOnboardingData) => {
    console.log("Updating onboarding with ID:", onboardingId, "and data:", data);
    const response = await axios.put(`${API_BASE_URL}/${onboardingId}`, data);
    return response.data;
}

export const getOnboardings = async () => {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
};

export const deleteOnboarding = async (onboardingId: number) => {
    console.log("Deleting onboarding with ID:", onboardingId);
    const response = await axios.delete(`${API_BASE_URL}/${onboardingId}`);
    return response.data;
}
