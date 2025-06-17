import { Request, Response } from "express";
import { OnboardingTypeService } from "../services/onboardingtype.service";
import {
    CreateOnboardingTypeDto,
    UpdateOnboardingTypeDto,
    OnboardingTypeCreateResult,
    GetAllOnboardingTypesResult,
    GetOnboardingTypeByIdResult,
    OnboardingTypeUpdateResult,
    OnboardingTypeDeleteResult,
} from "../dtos/onboardingtype.dtos";

export class OnboardingTypeController {
    constructor(private onboardingTypeService: OnboardingTypeService) {}

    async createOnboardingType(req: Request, res: Response): Promise<void> {
        try {
            const createDto: CreateOnboardingTypeDto = req.body;
            const result: OnboardingTypeCreateResult =
                await this.onboardingTypeService.createOnboardingType(
                    createDto
                );

            if (result.errors && result.errors.length > 0) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            res.status(201).json(result.onboardingType);
        } catch (error) {
            console.error("Error in OnboardingTypeController create:", error);
            res.status(500).json({
                message: "Error creating onboarding type",
                error: (error as Error).message,
            });
        }
    }

    async getAllOnboardingTypes(req: Request, res: Response): Promise<void> {
        try {
            const result: GetAllOnboardingTypesResult =
                await this.onboardingTypeService.getAllOnboardingTypes();

            if (result.errors && result.errors.length > 0) {
                res.status(500).json({ errors: result.errors });
                return;
            }
            res.status(200).json(result.onboardingTypes);
        } catch (error) {
            console.error("Error in OnboardingTypeController getAll:", error);
            res.status(500).json({
                message: "Error fetching onboarding types",
                error: (error as Error).message,
            });
        }
    }

    async getOnboardingTypeById(req: Request, res: Response): Promise<void> {
        try {
            const typeId = parseInt(req.params.typeId);
            if (isNaN(typeId)) {
                res.status(400).json({ message: "Invalid type ID." });
                return;
            }

            const result: GetOnboardingTypeByIdResult =
                await this.onboardingTypeService.getOnboardingTypeById(typeId);

            if (result.notFound) {
                res.status(404).json({ message: "Onboarding type not found." });
                return;
            }

            if (result.errors && result.errors.length > 0) {
                res.status(500).json({ errors: result.errors });
                return;
            }

            res.status(200).json(result.onboardingType);
        } catch (error) {
            console.error("Error in OnboardingTypeController getById:", error);
            res.status(500).json({
                message: "Error fetching onboarding type",
                error: (error as Error).message,
            });
        }
    }

    async updateOnboardingType(req: Request, res: Response): Promise<void> {
        try {
            const typeId = parseInt(req.params.typeId);
            if (isNaN(typeId)) {
                res.status(400).json({ message: "Invalid type ID." });
                return;
            }
            const updateDto: UpdateOnboardingTypeDto = req.body;

            const result: OnboardingTypeUpdateResult =
                await this.onboardingTypeService.updateOnboardingType(
                    typeId,
                    updateDto
                );

            if (result.notFound) {
                res.status(404).json({ message: "Onboarding type not found." });
                return;
            }

            if (result.errors && result.errors.length > 0) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            res.status(200).json(result.onboardingType);
        } catch (error) {
            console.error("Error in OnboardingTypeController update:", error);
            res.status(500).json({
                message: "Error updating onboarding type",
                error: (error as Error).message,
            });
        }
    }

    async deleteOnboardingType(req: Request, res: Response): Promise<void> {
        try {
            const typeId = parseInt(req.params.typeId);
            if (isNaN(typeId)) {
                res.status(400).json({ message: "Invalid type ID." });
                return;
            }

            const result: OnboardingTypeDeleteResult =
                await this.onboardingTypeService.deleteOnboardingType(typeId);

            if (result.notFound) {
                res.status(404).json({ message: "Onboarding type not found." });
                return;
            }

            if (result.errors && result.errors.length > 0) {
                if (result.hasOnboardings) {
                    res.status(400).json({
                        message:
                            "Cannot delete onboarding type with associated onboarding processes.",
                        errors: result.errors,
                    });
                } else {
                    res.status(400).json({ errors: result.errors });
                }
                return;
            }

            if (result.success) {
                res.status(200).json({
                    message: "Onboarding type deleted successfully.",
                });
            } else {
                res.status(500).json({
                    message:
                        "Error deleting onboarding type, operation unsuccessful.",
                });
            }
        } catch (error) {
            console.error("Error in OnboardingTypeController delete:", error);
            res.status(500).json({
                message: "Error deleting onboarding type",
                error: (error as Error).message,
            });
        }
    }
}
