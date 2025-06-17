import { Request, Response } from "express";
import { RoleService } from "../services/role.service";
import {
    CreateRoleDto,
    UpdateRoleDto,
    RoleCreateResult,
    GetAllRolesResult,
    RoleUpdateResult,
    RoleDeleteResult,
} from "../dtos/role.dtos";

export class RoleController {
    constructor(private roleService: RoleService) {}

    async createRole(req: Request, res: Response): Promise<void> {
        try {
            const createRoleDto: CreateRoleDto = req.body;

            const result: RoleCreateResult = await this.roleService.createRole(
                createRoleDto
            );

            if (result.errors && result.errors.length > 0) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            res.status(201).json(result.role);
        } catch (error) {
            res.status(500).json({
                message: "Error creating role",
                error: (error as Error).message,
            });
        }
    }

    async getRoles(req: Request, res: Response): Promise<void> {
        try {
            const result: GetAllRolesResult = await this.roleService.getRoles();
            if (result.errors && result.errors.length > 0) {
                res.status(500).json({ errors: result.errors });
                return;
            }
            res.json(result.roles);
        } catch (error) {
            res.status(500).json({
                message: "Error fetching roles",
                error: (error as Error).message,
            });
        }
    }

    async updateRole(req: Request, res: Response): Promise<void> {
        try {
            const roleId = parseInt(req.params.roleId);
            const updateRoleDto: UpdateRoleDto = req.body;

            const result: RoleUpdateResult = await this.roleService.updateRole(
                roleId,
                updateRoleDto
            );

            if (result.notFound) {
                res.status(404).json({ message: "Role not found" });
                return;
            }

            if (result.errors && result.errors.length > 0) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            res.json(result.role);
        } catch (error) {
            res.status(500).json({
                message: "Error updating role",
                error: (error as Error).message,
            });
        }
    }

    async deleteRole(req: Request, res: Response): Promise<void> {
        try {
            const roleId = parseInt(req.params.roleId);

            const result: RoleDeleteResult = await this.roleService.deleteRole(
                roleId
            );

            if (result.notFound) {
                res.status(404).json({ message: "Role not found" });
                return;
            }

            if (result.errors && result.errors.length > 0) {
                if (result.hasEmployees) {
                    res.status(400).json({
                        message: "Cannot delete role with associated employees",
                        errors: result.errors,
                    });
                } else {
                    res.status(400).json({ errors: result.errors });
                }
                return;
            }

            if (result.success) {
                res.status(200).json({ message: "Role deleted successfully" });
            } else {
                res.status(500).json({
                    message: "Error deleting role, operation unsuccessful.",
                });
            }
        } catch (error) {
            res.status(500).json({
                message: "Error deleting role",
                error: (error as Error).message,
            });
        }
    }
}
