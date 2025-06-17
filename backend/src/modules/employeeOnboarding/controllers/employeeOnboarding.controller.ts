import { Request, Response } from "express";
import { EmployeeOnboardingService } from "../services/employeeOnboarding.service";
import {
    AssignEmployeeToOnboardingDto,
    UpdateEmployeeOnboardingStatusDto,
    AssignEmployeeResult,
    UpdateAssignmentStatusResult,
    GetAssignmentResult,
    GetAssignmentsListResult,
    UnassignEmployeeResult,
} from "../dtos/employeeOnboarding.dtos";

export class EmployeeOnboardingController {
    constructor(private employeeOnboardingService: EmployeeOnboardingService) {}

    async assignEmployee(req: Request, res: Response): Promise<void> {
        try {
            const dto: AssignEmployeeToOnboardingDto = req.body;

            const result: AssignEmployeeResult =
                await this.employeeOnboardingService.assignEmployeeToOnboarding(
                    dto
                );

            if (result.errors && result.errors.length > 0) {
                if (result.employeeNotFound) {
                    res.status(404).json({
                        message: "Employee not found.",
                        errors: result.errors,
                    });
                } else if (result.onboardingNotFound) {
                    res.status(404).json({
                        message: "Onboarding process not found.",
                        errors: result.errors,
                    });
                } else if (result.alreadyAssigned) {
                    res.status(409).json({
                        message:
                            "Employee already assigned to this onboarding process.",
                        errors: result.errors,
                    });
                } else {
                    res.status(400).json({ errors: result.errors });
                }
                return;
            }

            res.status(201).json(result.employeeOnboarding);
        } catch (error) {
            console.error(
                "Error in EmployeeOnboardingController assignEmployee:",
                error
            );
            res.status(500).json({
                message: "Error assigning employee to onboarding process",
                error: (error as Error).message,
            });
        }
    }

    async updateAssignmentStatus(req: Request, res: Response): Promise<void> {
        try {
            const onboardingId = parseInt(req.params.onboardingId);
            const employeeEmail = req.params.employeeEmail;
            const dto: UpdateEmployeeOnboardingStatusDto = req.body;

            const result: UpdateAssignmentStatusResult =
                await this.employeeOnboardingService.updateAssignmentStatus(
                    onboardingId,
                    employeeEmail,
                    dto
                );

            if (result.notFound) {
                res.status(404).json({ message: "Assignment not found." });
                return;
            }
            if (result.errors && result.errors.length > 0) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            res.status(200).json(result.employeeOnboarding);
        } catch (error) {
            console.error(
                "Error in EmployeeOnboardingController updateAssignmentStatus:",
                error
            );
            res.status(500).json({
                message: "Error updating assignment status",
                error: (error as Error).message,
            });
        }
    }

    async getAssignment(req: Request, res: Response): Promise<void> {
        try {
            const onboardingId = parseInt(req.params.onboardingId);
            const employeeEmail = req.params.employeeEmail;

            const result: GetAssignmentResult =
                await this.employeeOnboardingService.getAssignment(
                    onboardingId,
                    employeeEmail
                );

            if (result.notFound) {
                res.status(404).json({ message: "Assignment not found." });
                return;
            }
            if (result.errors && result.errors.length > 0) {
                res.status(500).json({ errors: result.errors });
                return;
            }

            res.status(200).json(result.employeeOnboarding);
        } catch (error) {
            console.error(
                "Error in EmployeeOnboardingController getAssignment:",
                error
            );
            res.status(500).json({
                message: "Error retrieving assignment",
                error: (error as Error).message,
            });
        }
    }

    async getAssignmentsForEmployee(
        req: Request,
        res: Response
    ): Promise<void> {
        try {
            const employeeEmail = req.params.employeeEmail;

            const result: GetAssignmentsListResult =
                await this.employeeOnboardingService.getAssignmentsForEmployee(
                    employeeEmail
                );

            if (result.errors && result.errors.length > 0) {
                res.status(500).json({ errors: result.errors });
                return;
            }

            res.status(200).json(result.employeeOnboardings);
        } catch (error) {
            console.error(
                "Error in EmployeeOnboardingController getAssignmentsForEmployee:",
                error
            );
            res.status(500).json({
                message: "Error retrieving assignments for employee",
                error: (error as Error).message,
            });
        }
    }

    async getAssignmentsForOnboarding(
        req: Request,
        res: Response
    ): Promise<void> {
        try {
            const onboardingId = parseInt(req.params.onboardingId);

            const result: GetAssignmentsListResult =
                await this.employeeOnboardingService.getAssignmentsForOnboarding(
                    onboardingId
                );

            if (result.errors && result.errors.length > 0) {
                res.status(500).json({ errors: result.errors });
                return;
            }

            res.status(200).json(result.employeeOnboardings);
        } catch (error) {
            console.error(
                "Error in EmployeeOnboardingController getAssignmentsForOnboarding:",
                error
            );
            res.status(500).json({
                message: "Error retrieving assignments for onboarding process",
                error: (error as Error).message,
            });
        }
    }

    async unassignEmployee(req: Request, res: Response): Promise<void> {
        try {
            const onboardingId = parseInt(req.params.onboardingId);
            const employeeEmail = req.params.employeeEmail;

            const result: UnassignEmployeeResult =
                await this.employeeOnboardingService.unassignEmployee(
                    onboardingId,
                    employeeEmail
                );

            if (result.notFound) {
                res.status(404).json({
                    message: "Assignment not found to delete.",
                });
                return;
            }
            if (result.errors && result.errors.length > 0) {
                res.status(400).json({ errors: result.errors });
                return;
            }
            if (result.success) {
                res.status(200).json({
                    message: "Employee unassigned successfully.",
                });
            } else {
                res.status(500).json({
                    message:
                        "Error unassigning employee, operation unsuccessful.",
                });
            }
        } catch (error) {
            console.error(
                "Error in EmployeeOnboardingController unassignEmployee:",
                error
            );
            res.status(500).json({
                message: "Error unassigning employee",
                error: (error as Error).message,
            });
        }
    }
}
