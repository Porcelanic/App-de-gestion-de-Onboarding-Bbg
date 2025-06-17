import axios from "axios";

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

export const assignEmployeeToOnboarding = async (
    assignEmployeeToOnboardingData
) => {
    const response = await axios.post(
        `${API_BASE_URL}`,
        assignEmployeeToOnboardingData
    );
    return response.data;
};

export const unassignEmployeeFromOnboarding = async (
    onboardingId: number,
    employeeEmail: string
) => {
    const response = await axios.delete(
        `${API_BASE_URL}/${onboardingId}/employees/${employeeEmail}`
    );
    return response.data;
};

export const getEmployeeOnboardings = async (onboardingId: number) => {
    const response = await axios.get(
        `${API_BASE_URL}/onboarding/${onboardingId}`
    );
    return response.data;
};
