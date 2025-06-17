import { Request, Response } from "express";
import { OnboardingService } from "../services/onboarding.service";
import {
    CreateOnboardingDto,
    UpdateOnboardingDto,
    OnboardingCreateResult,
    GetAllOnboardingsResult,
    GetOnboardingByIdResult,
    OnboardingUpdateResult,
    OnboardingDeleteResult,
} from "../dtos/onboarding.dtos";

export class OnboardingController {
    constructor(private onboardingService: OnboardingService) {}

    async createOnboarding(req: Request, res: Response): Promise<void> {
        try {
            const { name, startDate, endDate, typeId } = req.body;

            const createDto: CreateOnboardingDto = {
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                typeId,
            };

            const result: OnboardingCreateResult =
                await this.onboardingService.createOnboarding(createDto);

            if (result.errors && result.errors.length > 0) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            res.status(201).json(result.onboarding);
        } catch (error) {
            console.error("Error in OnboardingController create:", error);
            res.status(500).json({
                message: "Error creating onboarding process",
                error: (error as Error).message,
            });
        }
    }

    async getAllOnboardings(req: Request, res: Response): Promise<void> {
        try {
            const result: GetAllOnboardingsResult =
                await this.onboardingService.getAllOnboardings();

            if (result.errors && result.errors.length > 0) {
                res.status(500).json({ errors: result.errors });
                return;
            }
            res.status(200).json(result.onboardings);
        } catch (error) {
            console.error("Error in OnboardingController getAll:", error);
            res.status(500).json({
                message: "Error fetching onboarding processes",
                error: (error as Error).message,
            });
        }
    }

    async getOnboardingById(req: Request, res: Response): Promise<void> {
        try {
            const onboardingId = parseInt(req.params.onboardingId);
            if (isNaN(onboardingId)) {
                res.status(400).json({ message: "Invalid onboarding ID." });
                return;
            }

            const result: GetOnboardingByIdResult =
                await this.onboardingService.getOnboardingById(onboardingId);

            if (result.notFound) {
                res.status(404).json({
                    message: "Onboarding process not found.",
                });
                return;
            }

            if (result.errors && result.errors.length > 0) {
                res.status(500).json({ errors: result.errors });
                return;
            }

            res.status(200).json(result.onboarding);
        } catch (error) {
            console.error("Error in OnboardingController getById:", error);
            res.status(500).json({
                message: "Error fetching onboarding process",
                error: (error as Error).message,
            });
        }
    }

    async updateOnboarding(req: Request, res: Response): Promise<void> {
        try {
            const onboardingId = parseInt(req.params.onboardingId);

            const { name, startDate, endDate, typeId } = req.body;
            const updateDto: UpdateOnboardingDto = {};

            if (name !== undefined) updateDto.name = name;
            if (startDate !== undefined)
                updateDto.startDate = new Date(startDate);
            if (endDate !== undefined) updateDto.endDate = new Date(endDate);
            if (typeId !== undefined) updateDto.typeId = typeId;

            if (Object.keys(updateDto).length === 0) {
                res.status(400).json({ message: "No update data provided." });
                return;
            }

            const result: OnboardingUpdateResult =
                await this.onboardingService.updateOnboarding(
                    onboardingId,
                    updateDto
                );

            if (result.notFound) {
                res.status(404).json({
                    message: "Onboarding process not found.",
                });
                return;
            }

            if (result.errors && result.errors.length > 0) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            res.status(200).json(result.onboarding);
        } catch (error) {
            console.error("Error in OnboardingController update:", error);
            res.status(500).json({
                message: "Error updating onboarding process",
                error: (error as Error).message,
            });
        }
    }

    async deleteOnboarding(req: Request, res: Response): Promise<void> {
        try {
            const onboardingId = parseInt(req.params.onboardingId);

            const result: OnboardingDeleteResult =
                await this.onboardingService.deleteOnboarding(onboardingId);

            if (result.notFound) {
                res.status(404).json({
                    message: "Onboarding process not found.",
                });
                return;
            }

            if (result.errors && result.errors.length > 0) {
                if (result.hasEmployeeOnboardings) {
                    res.status(400).json({
                        message:
                            "Cannot delete onboarding process with associated employee records.",
                        errors: result.errors,
                    });
                } else {
                    res.status(400).json({ errors: result.errors });
                }
                return;
            }

            if (result.success) {
                res.status(200).json({
                    message: "Onboarding process deleted successfully.",
                });
            } else {
                res.status(500).json({
                    message:
                        "Error deleting onboarding process, operation unsuccessful.",
                });
            }
        } catch (error) {
            console.error("Error in OnboardingController delete:", error);
            res.status(500).json({
                message: "Error deleting onboarding process",
                error: (error as Error).message,
            });
        }
    }
}
