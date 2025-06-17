import { EmployeeOnboardingController } from "./employeeOnboarding.controller";
import { EmployeeOnboardingService } from "../services/employeeOnboarding.service";
import { EmployeeOnboardingRepository } from "../repositories/employeeOnboarding.repository";
import { EmployeeRepository } from "../../employee/employee/repositories/employee.repository";
import { OnboardingRepository } from "../../onboarding/onboarding/repositories/onboarding.repository";

const employeeOnboardingRepository = new EmployeeOnboardingRepository();
const employeeRepository = new EmployeeRepository();
const onboardingRepository = new OnboardingRepository();
const employeeOnboardingService = new EmployeeOnboardingService(
    employeeOnboardingRepository,
    onboardingRepository,
    employeeRepository
);
const employeeOnboardingController = new EmployeeOnboardingController(
    employeeOnboardingService
);

export { employeeOnboardingController };
