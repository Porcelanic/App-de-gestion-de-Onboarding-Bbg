import { AppDataSource } from "../../../../config/ormconfig";
import { Employee } from "../../../../entities/employee/Employee";
import { Repository, DeleteResult } from "typeorm";
import { CreateEmployeeDto, UpdateEmployeeDto } from "../dtos/employee.dtos";

export class EmployeeRepository {
    private repository: Repository<Employee>;

    constructor() {
        this.repository = AppDataSource.getRepository(Employee);
    }

    async findOneByEmail(employeeEmail: string): Promise<Employee | null> {
        return this.repository.findOne({
            where: { employeeEmail },
            relations: ["role", "employeeOnboardings"],
        });
    }

    async findAll(): Promise<Employee[]> {
        return this.repository.find({
            relations: ["role", "employeeOnboardings"],
        });
    }

    async createEmployee(
        createEmployeeDto: CreateEmployeeDto
    ): Promise<Employee> {
        const employee = new Employee();
        employee.employeeEmail = createEmployeeDto.employeeEmail;
        employee.name = createEmployeeDto.name;
        employee.password = createEmployeeDto.password;
        employee.hireDate = createEmployeeDto.hireDate;
        employee.terminationDate = createEmployeeDto.terminationDate;
        employee.roleId = createEmployeeDto.roleId;

        return this.repository.save(employee);
    }

    async updateEmployee(
        employeeEmail: string,
        updateEmployeeDto: UpdateEmployeeDto
    ): Promise<Employee | null> {
        const employee = await this.repository.findOne({
            where: { employeeEmail },
        });
        if (!employee) {
            return null;
        }

        if (updateEmployeeDto.name !== undefined) {
            employee.name = updateEmployeeDto.name;
        }
        if (updateEmployeeDto.password !== undefined) {
            employee.password = updateEmployeeDto.password;
        }
        if (updateEmployeeDto.hireDate !== undefined) {
            employee.hireDate = updateEmployeeDto.hireDate;
        }
        if (updateEmployeeDto.terminationDate !== undefined) {
            employee.terminationDate = updateEmployeeDto.terminationDate;
        }
        if (updateEmployeeDto.roleId !== undefined) {
            employee.roleId = updateEmployeeDto.roleId;
        }

        return this.repository.save(employee);
    }

    async deleteEmployee(employeeEmail: string): Promise<DeleteResult> {
        return this.repository.delete({ employeeEmail });
    }
}
