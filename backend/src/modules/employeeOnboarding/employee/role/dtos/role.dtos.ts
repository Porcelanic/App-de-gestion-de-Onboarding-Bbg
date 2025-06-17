import { Role } from "../../../../../entities/Role";

export interface CreateRoleDto {
    title: string;
    description: string;
}

export interface UpdateRoleDto {
    title: string;
    description: string;
}

export interface RoleDto {
    roleId: number;
    title: string;
    description: string;
}

export interface RoleCreateResult {
    role?: RoleDto;
    errors?: string[];
}

export interface GetAllRolesResult {
    roles?: RoleDto[];
    errors?: string[];
}

export interface RoleUpdateResult {
    role?: RoleDto;
    errors?: string[];
    notFound?: boolean;
}

export interface RoleDeleteResult {
    success?: boolean;
    errors?: string[];
    notFound?: boolean;
    hasEmployees?: boolean;
}
