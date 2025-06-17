import { CreateEmployeeDto, UpdateEmployeeDto, LoginEmployeeDto } from "../dtos/employee.dtos";

export function validatePassword(password: string): string[] {
    const errors: string[] = [];
    if (!password || password.length < 8) {
        errors.push("The password must be at least 8 characters long.");
    }

    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
        errors.push("The password must have at least one uppercase letter.");
    }

    const specialCharRegex = /[!@#$%^+&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
        errors.push("The password must have at least one special character.");
    }
    return errors;
}

export function validateCreateEmployee(dto: CreateEmployeeDto): string[] {
    let errors: string[] = [];

    if (!dto.employeeEmail) {
        errors.push("Employee email is required.");
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dto.employeeEmail)) {
            errors.push("Must be a valid email for employeeEmail.");
        }
    }

    if (!dto.name || dto.name.trim() === "") {
        errors.push("Name is required.");
    } else if (dto.name.length > 255) {
        errors.push("Name cannot exceed 255 characters.");
    }

    if (!dto.password) {
        errors.push("Password is required.");
    } else {
        errors = errors.concat(validatePassword(dto.password));
    }

    if (!dto.hireDate) {
        errors.push("Hire date is required.");
    } else if (isNaN(new Date(dto.hireDate).getTime())) {
        errors.push("Invalid hire date format.");
    }

    if (dto.terminationDate && isNaN(new Date(dto.terminationDate).getTime())) {
        errors.push("Invalid termination date format.");
    }

    if (dto.hireDate && dto.terminationDate && new Date(dto.terminationDate) < new Date(dto.hireDate)) {
        errors.push("Termination date cannot be before hire date.");
    }

    if (dto.roleId === undefined || dto.roleId === null) {
        errors.push("Role ID is required.");
    } else if (typeof dto.roleId !== 'number') {
        errors.push("Role ID must be a number.");
    }
    
    return errors;
}

export function validateUpdateEmployee(dto: UpdateEmployeeDto): string[] {
    const errors: string[] = [];

    if (dto.name !== undefined) {
        if (dto.name.trim() === "") {
            errors.push("Name cannot be empty.");
        } else if (dto.name.length > 255) {
            errors.push("Name cannot exceed 255 characters.");
        }
    }

    if (dto.password !== undefined) {
        errors.concat(validatePassword(dto.password));
    }

    if (dto.hireDate !== undefined && isNaN(new Date(dto.hireDate).getTime())) {
        errors.push("Invalid hire date format.");
    }

    if (dto.terminationDate !== undefined) {
        if (isNaN(new Date(dto.terminationDate).getTime())) {
            errors.push("Invalid termination date format.");
        }
    }

    if (dto.roleId !== undefined && typeof dto.roleId !== 'number') {
        errors.push("Role ID must be a number.");
    }

    return errors;
}

export function validateLogin(dto: LoginEmployeeDto): string[] {
    const errors: string[] = [];

    if (!dto.employeeEmail) {
        errors.push("Employee email is required.");
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dto.employeeEmail)) {
            errors.push("Must be a valid email for employeeEmail.");
        }
    }

    if (!dto.password) {
        errors.push("Password is required.");
    }

    return errors;
}
