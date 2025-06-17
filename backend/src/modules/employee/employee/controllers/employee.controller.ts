import { Request, Response } from "express";
import { EmployeeService } from "../services/employee.service";
import {
    CreateEmployeeDto,
    LoginEmployeeDto,
    UpdateEmployeeDto,
} from "../dtos/employee.dtos";

export class EmployeeController {
    constructor(private employeeService: EmployeeService) {}

    async registerEmployee(req: Request, res: Response): Promise<void> {
        try {
            const createEmployeeDto: CreateEmployeeDto = req.body;
            const result = await this.employeeService.registerEmployee(
                createEmployeeDto
            );

            if (result.errors) {
                res.status(400).json({ errors: result.errors });
                return;
            }
            res.status(201).json(result.user);
        } catch (error) {
            console.error("Error in registerEmployee controller:", error);
            res.status(500).json({ errors: ["An unexpected error occurred."] });
        }
    }

    async loginEmployee(req: Request, res: Response): Promise<void> {
        try {
            const loginEmployeeDto: LoginEmployeeDto = req.body;
            const result = await this.employeeService.loginEmployee(
                loginEmployeeDto
            );

            if (result.errors) {
                res.status(401).json({ errors: result.errors });
                return;
            }
            res.status(200).json(result.tokens);
        } catch (error) {
            console.error("Error in loginEmployee controller:", error);
            res.status(500).json({ errors: ["An unexpected error occurred."] });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.body;
            if (!token) {
                res.status(400).json({ error: "Refresh token is required." });
                return;
            }
            const result = await this.employeeService.refreshToken(token);

            if (result.error) {
                res.status(401).json({ error: result.error });
                return;
            }
            res.status(200).json({ accessToken: result.accessToken });
        } catch (error) {
            console.error("Error in refreshToken controller:", error);
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }

    async getAllEmployees(req: Request, res: Response): Promise<void> {
        try {
            const employees = await this.employeeService.getAllEmployees();
            res.status(200).json(employees);
        } catch (error) {
            console.error("Error in getAllEmployees controller:", error);
            res.status(500).json({
                errors: [
                    "An unexpected error occurred while fetching employees.",
                ],
            });
        }
    }

    async getEmployeeByEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.params;
            const employee = await this.employeeService.getEmployeeByEmail(
                email
            );
            if (!employee) {
                res.status(404).json({ errors: ["Employee not found."] });
                return;
            }
            res.status(200).json(employee);
        } catch (error) {
            console.error("Error in getEmployeeByEmail controller:", error);
            res.status(500).json({
                errors: [
                    "An unexpected error occurred while fetching the employee.",
                ],
            });
        }
    }

    async updateEmployee(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.params;
            const updateEmployeeDto: UpdateEmployeeDto = req.body;
            const result = await this.employeeService.updateEmployee(
                email,
                updateEmployeeDto
            );

            if (result.errors) {
                if (
                    result.errors.some((e) =>
                        e.toLowerCase().includes("not found")
                    )
                ) {
                    res.status(404).json({ errors: result.errors });
                } else {
                    res.status(400).json({ errors: result.errors });
                }
                return;
            }
            res.status(200).json(result.employee);
        } catch (error) {
            console.error("Error in updateEmployee controller:", error);
            res.status(500).json({
                errors: [
                    "An unexpected error occurred while updating the employee.",
                ],
            });
        }
    }

    async deleteEmployee(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.params;
            const result = await this.employeeService.deleteEmployee(email);

            if (!result.success) {
                res.status(404).json({
                    errors: result.errors || [
                        "Employee not found or delete failed.",
                    ],
                });
                return;
            }
            res.status(204).send();
        } catch (error) {
            console.error("Error in deleteEmployee controller:", error);
            res.status(500).json({
                errors: [
                    "An unexpected error occurred while deleting the employee.",
                ],
            });
        }
    }
}
