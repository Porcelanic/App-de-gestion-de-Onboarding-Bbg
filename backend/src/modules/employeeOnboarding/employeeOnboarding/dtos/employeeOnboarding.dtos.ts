import { OnboardingDto } from "../../onboarding/onboarding/dtos/onboarding.dtos";
import { EmployeeDto } from "../../employee/employee/dtos/employee.dtos";

export interface AssignEmployeeToOnboardingDto {
  onboardingId: number;
  employeeEmail: string;
  done?: boolean;
}

export interface UpdateEmployeeOnboardingStatusDto {
  done: boolean;
}

export interface EmployeeOnboardingDto {
  onboardingId: number;
  employeeEmail: string;
  done: boolean;
  onboarding?: OnboardingDto;
  employee?: EmployeeDto;
}

export interface AssignEmployeeResult {
  employeeOnboarding?: EmployeeOnboardingDto;
  errors?: string[];
  employeeNotFound?: boolean;
  onboardingNotFound?: boolean;
  alreadyAssigned?: boolean;
}

export interface UpdateAssignmentStatusResult {
  employeeOnboarding?: EmployeeOnboardingDto;
  errors?: string[];
  notFound?: boolean;
}

export interface GetAssignmentResult {
  employeeOnboarding?: EmployeeOnboardingDto;
  errors?: string[];
  notFound?: boolean;
}

export interface GetAssignmentsListResult {
  employeeOnboardings?: EmployeeOnboardingDto[];
  errors?: string[];
}

export interface UnassignEmployeeResult {
  success?: boolean;
  errors?: string[];
  notFound?: boolean;
}