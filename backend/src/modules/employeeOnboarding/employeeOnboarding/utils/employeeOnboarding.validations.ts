import { EmployeeOnboardingRepository } from "../repositories/employeeOnboarding.repository";
import { OnboardingRepository } from "../../onboarding/onboarding/repositories/onboarding.repository";
import { EmployeeRepository } from "../../employee/employee/repositories/employee.repository";
import { AssignEmployeeToOnboardingDto } from "../dtos/employeeOnboarding.dtos";

export async function validateAssignEmployeeToOnboarding(
    dto: AssignEmployeeToOnboardingDto,
    employeeOnboardingRepository: EmployeeOnboardingRepository,
    onboardingRepository: OnboardingRepository,
    employeeRepository: EmployeeRepository
): Promise<string[]> {
    const errors: string[] = [];
    const { onboardingId, employeeEmail } = dto;

    if (onboardingId === undefined || onboardingId === null) {
        errors.push("Onboarding ID is required.");
    } else if (
        typeof onboardingId !== "number" ||
        !Number.isInteger(onboardingId) ||
        onboardingId <= 0
    ) {
        errors.push("Onboarding ID must be a positive integer.");
    } else {
        const onboardingExists = await onboardingRepository.findOneById(
            onboardingId
        );
        if (!onboardingExists) {
            errors.push(
                `Onboarding process with ID ${onboardingId} not found.`
            );
        }
    }

    if (!employeeEmail || employeeEmail.trim() === "") {
        errors.push("Employee email is required.");
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(employeeEmail)) {
            errors.push("Invalid employee email format.");
        } else {
            const employeeExists = await employeeRepository.findOneByEmail(
                employeeEmail
            );
            if (!employeeExists) {
                errors.push(`Employee with email ${employeeEmail} not found.`);
            }
        }
    }

    if (errors.length === 0) {
        const existingAssignment =
            await employeeOnboardingRepository.findOneByCompositeKey(
                onboardingId,
                employeeEmail
            );
        if (existingAssignment) {
            errors.push(
                `Employee ${employeeEmail} is already assigned to onboarding process ID ${onboardingId}.`
            );
        }
    }

    if (dto.done !== undefined && typeof dto.done !== "boolean") {
        errors.push(
            "The 'done' field must be a boolean value (true or false)."
        );
    }

    return errors;
}

export function validateUpdateStatus(done: any): string[] {
    const errors: string[] = [];
    if (done === undefined) {
        errors.push("The 'done' field is required.");
    } else if (typeof done !== "boolean") {
        errors.push(
            "The 'done' field must be a boolean value (true or false)."
        );
    }
    return errors;
}
