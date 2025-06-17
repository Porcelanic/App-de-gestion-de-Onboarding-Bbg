import { Onboarding } from "../../../../../entities/Onboarding";
import { OnboardingRepository } from "../repositories/onboarding.repository";
import { OnboardingTypeRepository } from "../../onboardingType/repositories/onboardingtype.repository";
import { validateOnboardingFields } from "../utils/onboarding.validations";
import {
    CreateOnboardingDto,
    UpdateOnboardingDto,
    OnboardingDto,
    OnboardingCreateResult,
    GetAllOnboardingsResult,
    GetOnboardingByIdResult,
    OnboardingUpdateResult,
    OnboardingDeleteResult,
} from "../dtos/onboarding.dtos";
import { OnboardingTypeDto } from "../../onboardingType/dtos/onboardingtype.dtos";

export class OnboardingService {
    constructor(
        private onboardingRepository: OnboardingRepository,
        private onboardingTypeRepository: OnboardingTypeRepository
    ) {}

    private mapToOnboardingDto(onboarding: Onboarding): OnboardingDto {
        let onboardingTypeDto: OnboardingTypeDto | undefined = undefined;
        if (onboarding.onboardingType) {
            onboardingTypeDto = {
                typeId: onboarding.onboardingType.typeId,
                name: onboarding.onboardingType.name,
                description: onboarding.onboardingType.description,
            };
        }

        return {
            onboardingId: onboarding.onboardingId,
            name: onboarding.name,
            startDate: onboarding.startDate,
            endDate: onboarding.endDate,
            typeId: onboarding.typeId,
            onboardingType: onboardingTypeDto,
        };
    }

    async createOnboarding(
        dto: CreateOnboardingDto
    ): Promise<OnboardingCreateResult> {
        const validationErrors = await validateOnboardingFields(
            this.onboardingRepository,
            this.onboardingTypeRepository,
            dto
        );

        if (validationErrors.length > 0) {
            return { errors: validationErrors };
        }
        dto.startDate.setDate(dto.startDate.getDate() + 1);
        dto.endDate.setDate(dto.endDate.getDate() + 1);
        const onboarding = new Onboarding();
        onboarding.name = dto.name;
        onboarding.startDate = dto.startDate;
        onboarding.endDate = dto.endDate;
        onboarding.typeId = dto.typeId;

        try {
            const savedOnboarding = await this.onboardingRepository.save(
                onboarding
            );

            const fullOnboarding =
                await this.onboardingRepository.findOneByIdWithOnboardingType(
                    savedOnboarding.onboardingId
                );
            return {
                onboarding: fullOnboarding
                    ? this.mapToOnboardingDto(fullOnboarding)
                    : undefined,
            };
        } catch (error) {
            console.error("Error creating onboarding process:", error);
            return { errors: ["Error creating onboarding process."] };
        }
    }

    async getAllOnboardings(): Promise<GetAllOnboardingsResult> {
        try {
            const onboardings = await this.onboardingRepository.findAll();
            return {
                onboardings: onboardings.map(this.mapToOnboardingDto),
            };
        } catch (error) {
            console.error("Error getting all onboarding processes:", error);
            return { errors: ["Error retrieving onboarding processes."] };
        }
    }

    async getOnboardingById(
        onboardingId: number
    ): Promise<GetOnboardingByIdResult> {
        try {
            const onboarding =
                await this.onboardingRepository.findOneByIdWithOnboardingType(
                    onboardingId
                );
            if (!onboarding) {
                return {
                    notFound: true,
                    errors: ["Onboarding process not found."],
                };
            }
            return { onboarding: this.mapToOnboardingDto(onboarding) };
        } catch (error) {
            console.error(
                `Error getting onboarding process by ID ${onboardingId}:`,
                error
            );
            return { errors: ["Error retrieving onboarding process."] };
        }
    }

    async updateOnboarding(
        onboardingId: number,
        dto: UpdateOnboardingDto
    ): Promise<OnboardingUpdateResult> {
        const existingOnboarding = await this.onboardingRepository.findOneById(
            onboardingId
        );
        if (!existingOnboarding) {
            return {
                notFound: true,
                errors: ["Onboarding process not found."],
            };
        }

        const dataToValidate = {
            name: dto.name ?? existingOnboarding.name,
            startDate: dto.startDate
                ? new Date(dto.startDate)
                : new Date(existingOnboarding.startDate),
            endDate: dto.endDate
                ? new Date(dto.endDate)
                : new Date(existingOnboarding.endDate),
            typeId: dto.typeId ?? existingOnboarding.typeId,
        };

        const validationErrors = await validateOnboardingFields(
            this.onboardingRepository,
            this.onboardingTypeRepository,
            dataToValidate,
            onboardingId
        );

        if (validationErrors.length > 0) {
            return { errors: validationErrors };
        }

        if (dto.name !== undefined) existingOnboarding.name = dto.name;
        if (dto.startDate !== undefined)
            existingOnboarding.startDate = new Date(dto.startDate);
        if (dto.endDate !== undefined)
            existingOnboarding.endDate = new Date(dto.endDate);
        if (dto.typeId !== undefined) existingOnboarding.typeId = dto.typeId;
        existingOnboarding.startDate.setDate(
            existingOnboarding.startDate.getDate() + 1
        );
        existingOnboarding.endDate.setDate(
            existingOnboarding.endDate.getDate() + 1
        );
        try {
            const updatedOnboardingEntity =
                await this.onboardingRepository.save(existingOnboarding);

            const fullOnboarding =
                await this.onboardingRepository.findOneByIdWithOnboardingType(
                    updatedOnboardingEntity.onboardingId
                );
            return {
                onboarding: fullOnboarding
                    ? this.mapToOnboardingDto(fullOnboarding)
                    : undefined,
            };
        } catch (error) {
            console.error(
                `Error updating onboarding process ${onboardingId}:`,
                error
            );
            return { errors: ["Error updating onboarding process."] };
        }
    }

    async deleteOnboarding(
        onboardingId: number
    ): Promise<OnboardingDeleteResult> {
        try {
            const onboardingWithRelations =
                await this.onboardingRepository.findOneByIdWithEmployeeOnboardings(
                    onboardingId
                );

            if (!onboardingWithRelations) {
                return {
                    notFound: true,
                    errors: ["Onboarding process not found."],
                };
            }

            if (
                onboardingWithRelations.employeeOnboardings &&
                onboardingWithRelations.employeeOnboardings.length > 0
            ) {
                return {
                    hasEmployeeOnboardings: true,
                    errors: [
                        "Onboarding process has associated employees and cannot be deleted.",
                    ],
                };
            }

            await this.onboardingRepository.delete(onboardingId);
            return { success: true };
        } catch (error) {
            console.error(
                `Error deleting onboarding process ${onboardingId}:`,
                error
            );
            return {
                success: false,
                errors: ["Error deleting onboarding process."],
            };
        }
    }
}
