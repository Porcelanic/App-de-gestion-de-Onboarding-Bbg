import axios from "axios";
import { UpdateEmployeeOnboarding } from "../types/UpdateEmployeeOnboarding";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/employee-onboarding";

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

export const getEmployeeOnboardings = async (employeeEmail: string) => {
    const response = await axios.get(
        `${API_BASE_URL}/employee/${employeeEmail}`
    );
    return response.data;
};

export const updateEmployeeOnboarding = async (
    employeeEmail: string,
    onboardingId: number,
    data: UpdateEmployeeOnboarding
) => {
    const response = await axios.patch(
        `${API_BASE_URL}/${onboardingId}/employees/${employeeEmail}`,
        data
    );
    return response.data;
};
