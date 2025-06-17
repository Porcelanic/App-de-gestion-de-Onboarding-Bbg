export interface CreateOnboardingTypeDto {
    name: string;
    description: string;
}

export interface UpdateOnboardingTypeDto {
    name?: string;
    description?: string;
}

export interface OnboardingTypeDto {
    typeId: number;
    name: string;
    description: string;
}

export interface OnboardingTypeCreateResult {
    onboardingType?: OnboardingTypeDto;
    errors?: string[];
}

export interface GetAllOnboardingTypesResult {
    onboardingTypes?: OnboardingTypeDto[];
    errors?: string[];
}

export interface GetOnboardingTypeByIdResult {
    onboardingType?: OnboardingTypeDto;
    errors?: string[];
    notFound?: boolean;
}

export interface OnboardingTypeUpdateResult {
    onboardingType?: OnboardingTypeDto;
    errors?: string[];
    notFound?: boolean;
}

export interface OnboardingTypeDeleteResult {
    success?: boolean;
    errors?: string[];
    notFound?: boolean;
    hasOnboardings?: boolean;
}
