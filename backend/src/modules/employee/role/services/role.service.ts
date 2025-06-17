import { Role } from "../../../../entities/employee/Role";
import { RoleRepository } from "../repositories/role.repository";
import { validateRoleFields } from "../utils/role.validations";
import {
    CreateRoleDto,
    UpdateRoleDto,
    RoleDto,
    RoleCreateResult,
    GetAllRolesResult,
    RoleUpdateResult,
    RoleDeleteResult,
} from "../dtos/role.dtos";

export class RoleService {
    constructor(private roleRepository: RoleRepository) {}

    private mapToRoleDto(role: Role): RoleDto {
        return {
            roleId: role.roleId,
            title: role.title,
            description: role.description,
        };
    }

    async createRole(dto: CreateRoleDto): Promise<RoleCreateResult> {
        const validationErrors = await validateRoleFields(
            this.roleRepository,
            dto.title,
            dto.description
        );

        if (validationErrors.length > 0) {
            return { errors: validationErrors };
        }

        const role = new Role();
        role.title = dto.title;
        role.description = dto.description;

        try {
            const savedRole = await this.roleRepository.save(role);
            return { role: this.mapToRoleDto(savedRole) };
        } catch (error) {
            console.error("Error creating role:", error);
            return { errors: ["Error creating role."] };
        }
    }

    async getRoles(): Promise<GetAllRolesResult> {
        try {
            const roles = await this.roleRepository.findAll();
            return { roles: roles.map(this.mapToRoleDto) };
        } catch (error) {
            console.error("Error getting roles:", error);
            return { errors: ["Error retrieving roles."] };
        }
    }

    async updateRole(
        roleId: number,
        dto: UpdateRoleDto
    ): Promise<RoleUpdateResult> {
        const validationErrors = await validateRoleFields(
            this.roleRepository,
            dto.title,
            dto.description,
            roleId
        );

        if (validationErrors.length > 0) {
            return { errors: validationErrors };
        }

        try {
            const role = await this.roleRepository.findOneByRoleId(roleId);
            if (!role) {
                return { notFound: true, errors: ["Role not found."] };
            }

            role.title = dto.title;
            role.description = dto.description;

            const updatedRole = await this.roleRepository.save(role);
            return { role: this.mapToRoleDto(updatedRole) };
        } catch (error) {
            console.error(`Error updating role ${roleId}:`, error);
            return { errors: ["Error updating role."] };
        }
    }

    async deleteRole(roleId: number): Promise<RoleDeleteResult> {
        try {
            const roleWithEmployees =
                await this.roleRepository.findOneWithEmployees(roleId);

            if (!roleWithEmployees) {
                return { notFound: true, errors: ["Role not found."] };
            }

            if (
                roleWithEmployees.employees &&
                roleWithEmployees.employees.length > 0
            ) {
                return {
                    hasEmployees: true,
                    errors: [
                        "Role has associated employees and cannot be deleted.",
                    ],
                };
            }

            await this.roleRepository.delete(roleId);
            return { success: true };
        } catch (error) {
            console.error(`Error deleting role ${roleId}:`, error);
            return { success: false, errors: ["Error deleting role."] };
        }
    }
}
