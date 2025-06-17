import { OnboardingType } from "../../../../../entities/OnboardingType";
import { OnboardingTypeRepository } from "../repositories/onboardingtype.repository";
import { validateOnboardingTypeFields } from "../utils/onboardingtype.validations";
import {
    CreateOnboardingTypeDto,
    UpdateOnboardingTypeDto,
    OnboardingTypeDto,
    OnboardingTypeCreateResult,
    GetAllOnboardingTypesResult,
    GetOnboardingTypeByIdResult,
    OnboardingTypeUpdateResult,
    OnboardingTypeDeleteResult,
} from "../dtos/onboardingtype.dtos";

export class OnboardingTypeService {
    constructor(private onboardingTypeRepository: OnboardingTypeRepository) {}

    private mapToOnboardingTypeDto(
        onboardingType: OnboardingType
    ): OnboardingTypeDto {
        return {
            typeId: onboardingType.typeId,
            name: onboardingType.name,
            description: onboardingType.description,
        };
    }

    async createOnboardingType(
        dto: CreateOnboardingTypeDto
    ): Promise<OnboardingTypeCreateResult> {
        const validationErrors = await validateOnboardingTypeFields(
            this.onboardingTypeRepository,
            dto
        );

        if (validationErrors.length > 0) {
            return { errors: validationErrors };
        }

        const onboardingType = new OnboardingType();
        onboardingType.name = dto.name;
        onboardingType.description = dto.description;

        try {
            const savedOnboardingType =
                await this.onboardingTypeRepository.save(onboardingType);
            return {
                onboardingType:
                    this.mapToOnboardingTypeDto(savedOnboardingType),
            };
        } catch (error) {
            console.error("Error creating onboarding type:", error);
            return { errors: ["Error creating onboarding type."] };
        }
    }

    async getAllOnboardingTypes(): Promise<GetAllOnboardingTypesResult> {
        try {
            const onboardingTypes =
                await this.onboardingTypeRepository.findAll();
            return {
                onboardingTypes: onboardingTypes.map(
                    this.mapToOnboardingTypeDto
                ),
            };
        } catch (error) {
            console.error("Error getting all onboarding types:", error);
            return { errors: ["Error retrieving onboarding types."] };
        }
    }

    async getOnboardingTypeById(
        typeId: number
    ): Promise<GetOnboardingTypeByIdResult> {
        try {
            const onboardingType =
                await this.onboardingTypeRepository.findOneByTypeId(typeId);
            if (!onboardingType) {
                return {
                    notFound: true,
                    errors: ["Onboarding type not found."],
                };
            }
            return {
                onboardingType: this.mapToOnboardingTypeDto(onboardingType),
            };
        } catch (error) {
            console.error(
                `Error getting onboarding type by ID ${typeId}:`,
                error
            );
            return { errors: ["Error retrieving onboarding type."] };
        }
    }

    async updateOnboardingType(
        typeId: number,
        dto: UpdateOnboardingTypeDto
    ): Promise<OnboardingTypeUpdateResult> {
        const validationData = {
            name: dto.name || "",
            description: dto.description || "",
        };

        const existingType =
            await this.onboardingTypeRepository.findOneByTypeId(typeId);
        if (!existingType) {
            return { notFound: true, errors: ["Onboarding type not found."] };
        }

        const dataToValidate = {
            name: dto.name ?? existingType.name,
            description: dto.description ?? existingType.description,
        };

        const validationErrors = await validateOnboardingTypeFields(
            this.onboardingTypeRepository,
            dataToValidate,
            typeId
        );

        if (validationErrors.length > 0) {
            return { errors: validationErrors };
        }

        try {
            if (dto.name !== undefined) existingType.name = dto.name;
            if (dto.description !== undefined)
                existingType.description = dto.description;

            const updatedOnboardingType =
                await this.onboardingTypeRepository.save(existingType);
            return {
                onboardingType: this.mapToOnboardingTypeDto(
                    updatedOnboardingType
                ),
            };
        } catch (error) {
            console.error(`Error updating onboarding type ${typeId}:`, error);
            return { errors: ["Error updating onboarding type."] };
        }
    }

    async deleteOnboardingType(
        typeId: number
    ): Promise<OnboardingTypeDeleteResult> {
        try {
            const onboardingTypeWithRelations =
                await this.onboardingTypeRepository.findOneWithOnboardings(
                    typeId
                );

            if (!onboardingTypeWithRelations) {
                return {
                    notFound: true,
                    errors: ["Onboarding type not found."],
                };
            }

            if (
                onboardingTypeWithRelations.onboardings &&
                onboardingTypeWithRelations.onboardings.length > 0
            ) {
                return {
                    hasOnboardings: true,
                    errors: [
                        "Onboarding type has associated onboarding processes and cannot be deleted.",
                    ],
                };
            }

            await this.onboardingTypeRepository.delete(typeId);
            return { success: true };
        } catch (error) {
            console.error(`Error deleting onboarding type ${typeId}:`, error);
            return {
                success: false,
                errors: ["Error deleting onboarding type."],
            };
        }
    }
}
