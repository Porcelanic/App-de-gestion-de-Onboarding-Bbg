import axios from "axios";
import { RegisterEmployeeData } from "../types/RegisterEmployeeData";
import { LoginEmployeeData } from "../types/LoginEmployeeData";
import { UpdateEmployeeData } from "../types/UpdateEmployeeData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/employee";

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

export const login = async (data: LoginEmployeeData) => {
    const response = await axios.post(`${API_BASE_URL}/login`, data);
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem("username", response.data.name);
    localStorage.setItem("email", response.data.employeeEmail);
    return response.data;
};

export const register = async (data: RegisterEmployeeData) => {
    console.log("Registering employee with data:", data);
    const response = await axios.post(`${API_BASE_URL}/register`, data);
    return response.data;
};

export const updateEmployee = async (
    employeeEmail: string,
    data: UpdateEmployeeData
) => {
    console.log(
        "Updating employee with email:",
        employeeEmail,
        "and data:",
        data
    );
    const response = await axios.put(`${API_BASE_URL}/${employeeEmail}`, data);
    return response.data;
};

export const getEmployees = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data.employees;
};

export const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post(`${API_BASE_URL}/refresh-token`, {
        token: refreshToken,
    });
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data.accessToken;
};
