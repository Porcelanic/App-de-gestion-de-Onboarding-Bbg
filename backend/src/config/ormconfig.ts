import { DataSource } from "typeorm";
import { Employee } from "../entities/employee/Employee";
import { Role } from "../entities/employee/Role";
import { Onboarding } from "../entities/onboarding/Onboarding";
import { OnboardingType } from "../entities/onboarding/OnboardingType";
import { EmployeeOnboarding } from "../entities/employeeOnboarding/EmployeeOnboarding";
import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
    "DB_HOST",
    "DB_PORT",
    "DB_USERNAME",
    "DB_PASSWORD",
    "DB_NAME",
];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Employee, Role, Onboarding, OnboardingType, EmployeeOnboarding],
    migrations: ["src/migrations/**/*.ts"],
    subscribers: ["src/subscribers/**/*.ts"],
});
