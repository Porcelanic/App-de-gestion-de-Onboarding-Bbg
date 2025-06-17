import { RoleRepository } from "../repositories/role.repository";

export async function validateRoleFields(
    roleRepository: RoleRepository,
    title: string,
    description: string,
    roleId?: number
): Promise<string[]> {
    const errors: string[] = [];

    if (!title || title.trim() === "") {
        errors.push("The title field is required.");
    } else if (title.length < 3 || title.length > 255) {
        errors.push("The title must be between 3 and 255 characters long.");
    } else {
        const existingRole = await roleRepository.findOneByTitle(title);

        if (existingRole && existingRole.roleId !== roleId) {
            errors.push("A role with this title already exists.");
        }
    }

    if (!description || description.trim() === "") {
        errors.push("The description field is required.");
    } else if (description.length > 255) {
        errors.push("The description cannot exceed 255 characters.");
    }

    return errors;
}
