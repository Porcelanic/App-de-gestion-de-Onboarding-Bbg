import { OnboardingRepository } from "../repositories/onboarding.repository";
import { OnboardingTypeRepository } from "../../onboardingType/repositories/onboardingtype.repository";

interface OnboardingValidationData {
    name: string;
    startDate: Date;
    endDate: Date;
    typeId: number;
}

export async function validateOnboardingFields(
    onboardingRepository: OnboardingRepository,
    onboardingTypeRepository: OnboardingTypeRepository,
    data: OnboardingValidationData,
    onboardingId?: number
): Promise<string[]> {
    const errors: string[] = [];
    const { name, startDate, endDate, typeId } = data;

    if (!name || name.trim() === "") {
        errors.push("The onboarding name field is required.");
    } else if (name.length < 3 || name.length > 255) {
        errors.push(
            "The onboarding name must be between 3 and 255 characters long."
        );
    } else {
        const existingOnboardingByName =
            await onboardingRepository.findOneByName(name);
        if (
            existingOnboardingByName &&
            existingOnboardingByName.onboardingId !== onboardingId
        ) {
            errors.push("An onboarding process with this name already exists.");
        }
    }

    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
        errors.push("Start date is invalid. Please provide a valid date.");
    }

    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
        errors.push("End date is invalid. Please provide a valid date.");
    }

    if (
        startDate instanceof Date &&
        !isNaN(startDate.getTime()) &&
        endDate instanceof Date &&
        !isNaN(endDate.getTime())
    ) {
        if (endDate < startDate) {
            errors.push("The end date cannot be before the start date.");
        }
    }

    if (typeId === undefined || typeId === null) {
        errors.push("The onboarding type ID field is required.");
    } else if (
        typeof typeId !== "number" ||
        typeId <= 0 ||
        !Number.isInteger(typeId)
    ) {
        errors.push("The onboarding type ID must be a positive integer.");
    } else {
        const onboardingTypeExists =
            await onboardingTypeRepository.findOneByTypeId(typeId);
        if (!onboardingTypeExists) {
            errors.push(
                `The onboarding type with ID ${typeId} does not exist.`
            );
        }
    }

    return errors;
}
