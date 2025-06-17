import { OnboardingTypeDto } from "../../onboardingType/dtos/onboardingtype.dtos";

export interface CreateOnboardingDto {
    name: string;
    startDate: Date;
    endDate: Date;
    typeId: number;
}

export interface UpdateOnboardingDto {
    name?: string;
    startDate?: Date;
    endDate?: Date;
    typeId?: number;
}

export interface OnboardingDto {
    onboardingId: number;
    name: string;
    startDate: Date;
    endDate: Date;
    typeId: number;
    onboardingType?: OnboardingTypeDto;
}

export interface OnboardingCreateResult {
    onboarding?: OnboardingDto;
    errors?: string[];
}

export interface GetAllOnboardingsResult {
    onboardings?: OnboardingDto[];
    errors?: string[];
}

export interface GetOnboardingByIdResult {
    onboarding?: OnboardingDto;
    errors?: string[];
    notFound?: boolean;
}

export interface OnboardingUpdateResult {
    onboarding?: OnboardingDto;
    errors?: string[];
    notFound?: boolean;
}

export interface OnboardingDeleteResult {
    success?: boolean;
    errors?: string[];
    notFound?: boolean;
    hasEmployeeOnboardings?: boolean;
}
