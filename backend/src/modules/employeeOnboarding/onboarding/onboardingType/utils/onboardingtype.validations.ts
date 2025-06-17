import { OnboardingTypeRepository } from "../repositories/onboardingtype.repository";

interface OnboardingTypeValidationData {
    name: string;
    description: string;
}

export async function validateOnboardingTypeFields(
    onboardingTypeRepository: OnboardingTypeRepository,
    data: OnboardingTypeValidationData,
    typeId?: number
): Promise<string[]> {
    const errors: string[] = [];
    const { name, description } = data;

    if (!name || name.trim() === "") {
        errors.push("The name field is required.");
    } else if (name.length < 3 || name.length > 255) {
        errors.push("The name must be between 3 and 255 characters long.");
    } else {
        const existingType = await onboardingTypeRepository.findOneByName(name);
        if (existingType && existingType.typeId !== typeId) {
            errors.push("An onboarding type with this name already exists.");
        }
    }

    if (!description || description.trim() === "") {
        errors.push("The description field is required.");
    } else if (description.length > 1000) {
        errors.push("The description cannot exceed 1000 characters.");
    }

    return errors;
}
