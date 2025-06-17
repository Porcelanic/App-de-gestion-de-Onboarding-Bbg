import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { EmployeeRepository } from "../repositories/employee.repository";
import { RoleRepository } from "../../role/repositories/role.repository";
import {
    CreateEmployeeDto,
    UpdateEmployeeDto,
    LoginEmployeeDto,
    RegisterResult,
    LoginResult,
    RefreshTokenResult,
    EmployeeDto,
    GetAllEmployeesResult,
    GetEmployeeByEmailResult,
    UpdateEmployeeResult,
    DeleteEmployeeResult,
} from "../dtos/employee.dtos";
import {
    validateCreateEmployee,
    validateLogin,
    validateUpdateEmployee,
} from "../utils/employee.validations";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/token.utils";
import { Employee } from "../../../../../entities/Employee";

export class EmployeeService {
    constructor(
        private employeeRepository: EmployeeRepository,
        private roleRepository: RoleRepository
    ) {}

    private mapToEmployeeDto(employee: Employee): EmployeeDto {
        return {
            employeeEmail: employee.employeeEmail,
            name: employee.name,
            hireDate: employee.hireDate,
            terminationDate: employee.terminationDate,
            roleId: employee.roleId,
            roleTitle: employee.role?.title,
        };
    }

    async registerEmployee(
        createDto: CreateEmployeeDto
    ): Promise<RegisterResult> {
        const errors = validateCreateEmployee(createDto);
        if (errors.length > 0) {
            return { errors };
        }

        const { employeeEmail, password, roleId } = createDto;
        const lowercasedEmail = employeeEmail.toLowerCase();

        const existingEmployee = await this.employeeRepository.findOneByEmail(
            lowercasedEmail
        );
        if (existingEmployee) {
            return { errors: ["Employee with this email already exists."] };
        }

        if (roleId !== undefined) {
            const roleExists = await this.roleRepository.findOneByRoleId(
                roleId
            );
            if (!roleExists) {
                return { errors: ["Specified Role ID does not exist."] };
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const employeeToCreate: CreateEmployeeDto = {
            ...createDto,
            employeeEmail: lowercasedEmail,
            password: hashedPassword,
        };

        try {
            const newEmployee = await this.employeeRepository.createEmployee(
                employeeToCreate
            );
            return { user: { employeeEmail: newEmployee.employeeEmail } };
        } catch (error) {
            console.error("Error registering employee:", error);
            return {
                errors: ["Error registering employee. Please try again later."],
            };
        }
    }

    async loginEmployee(loginDto: LoginEmployeeDto): Promise<LoginResult> {
        const errors = validateLogin(loginDto);
        if (errors.length > 0) {
            return { errors };
        }

        const { employeeEmail, password } = loginDto;
        const lowercasedEmail = employeeEmail.toLowerCase();

        const employee = await this.employeeRepository.findOneByEmail(
            lowercasedEmail
        );
        if (!employee || !(await bcrypt.compare(password, employee.password))) {
            return { errors: ["Invalid email or password."] };
        }

        if (employee.roleId === undefined) {
            console.error(
                `Employee ${employee.employeeEmail} does not have a roleId.`
            );
            return { errors: ["User role not configured. Access denied."] };
        }

        const role = await this.roleRepository.findOneByRoleId(employee.roleId);
        if (!role) {
            console.error(
                `Role with ID ${employee.roleId} not found for employee ${employee.employeeEmail}.`
            );
            return { errors: ["User role not found. Access denied."] };
        }

        if (role.title.toLowerCase() !== "admin") {
            return {
                errors: ["Access denied. Administrator privileges required."],
            };
        }

        const accessToken = generateAccessToken(employee.employeeEmail);
        const refreshToken = generateRefreshToken(employee.employeeEmail);

        return {
            tokens: {
                accessToken,
                refreshToken,
                name: employee.name,
                employeeEmail: employee.employeeEmail,
            },
        };
    }

    async refreshToken(token: string): Promise<RefreshTokenResult> {
        try {
            const secret = process.env.JWT_REFRESH_SECRET;
            if (!secret) {
                console.error("JWT_REFRESH_SECRET is not defined");
                return { error: "Internal server error." };
            }

            const decoded = jwt.verify(token, secret) as {
                employeeEmail: string;
            };
            const accessToken = generateAccessToken(decoded.employeeEmail);

            return { accessToken };
        } catch (error) {
            console.error("Error refreshing token:", error);
            return { error: "Invalid refresh token." };
        }
    }

    async getAllEmployees(): Promise<GetAllEmployeesResult> {
        try {
            const employees = await this.employeeRepository.findAll();
            return { employees: employees.map(this.mapToEmployeeDto) };
        } catch (error) {
            console.error("Error getting all employees:", error);
            return { errors: ["Error retrieving employees."] };
        }
    }

    async getEmployeeByEmail(
        employeeEmail: string
    ): Promise<GetEmployeeByEmailResult> {
        try {
            const employee = await this.employeeRepository.findOneByEmail(
                employeeEmail.toLowerCase()
            );
            if (!employee) {
                return { errors: ["Employee not found."] };
            }
            return { employee: this.mapToEmployeeDto(employee) };
        } catch (error) {
            console.error(
                `Error getting employee by email ${employeeEmail}:`,
                error
            );
            return { errors: ["Error retrieving employee."] };
        }
    }

    async updateEmployee(
        employeeEmail: string,
        updateDto: UpdateEmployeeDto
    ): Promise<UpdateEmployeeResult> {
        const validationErrors = validateUpdateEmployee(updateDto);
        if (validationErrors.length > 0) {
            return { errors: validationErrors };
        }

        const lowercasedEmail = employeeEmail.toLowerCase();
        let employeeToUpdate = { ...updateDto };

        if (updateDto.password) {
            const hashedPassword = await bcrypt.hash(updateDto.password, 10);
            employeeToUpdate.password = hashedPassword;
        }

        if (updateDto.hireDate) {
            employeeToUpdate.hireDate = updateDto.hireDate;
        }
        if (updateDto.terminationDate) {
            employeeToUpdate.terminationDate = updateDto.terminationDate;
        }

        try {
            const updatedEmployee =
                await this.employeeRepository.updateEmployee(
                    lowercasedEmail,
                    employeeToUpdate
                );
            if (!updatedEmployee) {
                return { errors: ["Employee not found or update failed."] };
            }
            return { employee: this.mapToEmployeeDto(updatedEmployee) };
        } catch (error) {
            console.error(`Error updating employee ${employeeEmail}:`, error);
            return { errors: ["Error updating employee."] };
        }
    }

    async deleteEmployee(employeeEmail: string): Promise<DeleteEmployeeResult> {
        const lowercasedEmail = employeeEmail.toLowerCase();
        try {
            const result = await this.employeeRepository.deleteEmployee(
                lowercasedEmail
            );
            if (result.affected && result.affected > 0) {
                return { success: true };
            }
            return {
                success: false,
                errors: ["Employee not found or delete failed."],
            };
        } catch (error) {
            console.error(`Error deleting employee ${employeeEmail}:`, error);
            return { success: false, errors: ["Error deleting employee."] };
        }
    }
}
