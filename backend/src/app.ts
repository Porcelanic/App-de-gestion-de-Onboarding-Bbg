import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import roleRoutes from "./routes/role.route";
import employeeRoutes from "./routes/employee.route";
import onboardingTypeRoutes from "./routes/onboardingType.route";
import onboardingRouters from "./routes/onboarding.route";
import employeeOnboardingRouters from "./routes/employeeOnboarding.route";
import cors from "cors";

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/role", roleRoutes);
app.use("/employee", employeeRoutes);
app.use("/onboarding-type", onboardingTypeRoutes);
app.use("/onboarding", onboardingRouters);
app.use("/employee-onboarding", employeeOnboardingRouters);
