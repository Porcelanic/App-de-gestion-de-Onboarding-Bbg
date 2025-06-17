import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "../services/employee.service";
import { EmployeeRepository } from "../repositories/employee.repository";
import { RoleRepository } from "../../role/repositories/role.repository";

const employeeRepository = new EmployeeRepository();
const roleRepository = new RoleRepository();
const employeeService = new EmployeeService(employeeRepository, roleRepository);
const employeeController = new EmployeeController(employeeService);

export { employeeController };
