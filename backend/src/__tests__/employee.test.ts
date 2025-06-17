import request from "supertest";
import { AppDataSource } from "../config/ormconfig";
import { Employee } from "../entities/Employee";
import { Role } from "../entities/Role";
import { app } from "../app";

interface TestEmployeeData {
    employeeEmail: string;
    name: string;
    password: string;
    hireDate: string;
    roleId: number;
}

describe("Employee API Routes", () => {
    const baseTestEmployeeData = {
        employeeEmail: "testemployee@example.com",
        name: "Test Employee",
        password: "TestPassword123!",
        hireDate: new Date().toISOString().split("T")[0],
    };
    let createdTestEmployee: TestEmployeeData;

    let testRole: Role;

    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const roleRepository = AppDataSource.getRepository(Role);

        const existingRole = await roleRepository.findOne({
            where: { title: "Test Role for Employee API" },
        });
        if (existingRole) {
            testRole = existingRole;
        } else {
            testRole = await roleRepository.save({
                title: "Test Role for Employee API",
                description:
                    "A temporary role created for API testing purposes",
            });
        }
        createdTestEmployee = {
            ...baseTestEmployeeData,
            roleId: testRole.roleId,
        };
    });

    afterAll(async () => {
        if (AppDataSource.isInitialized) {
            const employeeRepository = AppDataSource.getRepository(Employee);
            await employeeRepository
                .delete({ employeeEmail: createdTestEmployee.employeeEmail })
                .catch(() => {});

            const roleRepository = AppDataSource.getRepository(Role);

            if (
                testRole &&
                testRole.roleId &&
                testRole.description ===
                    "A temporary role created for API testing purposes"
            ) {
                const roleToDelete = await roleRepository.findOne({
                    where: { roleId: testRole.roleId },
                });
                if (roleToDelete) {
                    await roleRepository.remove(roleToDelete);
                }
            }
            await AppDataSource.destroy();
        }
    });

    describe("POST /employee/register", () => {
        afterEach(async () => {
            const employeeRepository = AppDataSource.getRepository(Employee);
            await employeeRepository
                .delete({ employeeEmail: createdTestEmployee.employeeEmail })
                .catch(() => {});
        });

        it("should register a new employee successfully", async () => {
            const response = await request(app)
                .post("/employee/register")
                .send(createdTestEmployee);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                employeeEmail: createdTestEmployee.employeeEmail,
            });

            const employee = await AppDataSource.getRepository(
                Employee
            ).findOne({
                where: { employeeEmail: createdTestEmployee.employeeEmail },
            });
            expect(employee).not.toBeNull();
            expect(employee?.name).toBe(createdTestEmployee.name);
            expect(employee?.roleId).toBe(createdTestEmployee.roleId);
        });

        it("should return 400 for invalid email format", async () => {
            const response = await request(app)
                .post("/employee/register")
                .send({
                    ...createdTestEmployee,
                    employeeEmail: "invalid-email-format",
                });

            expect(response.status).toBe(400);

            expect(response.body.errors).toBeDefined();
        });

        it("should return 400 for duplicate email", async () => {
            await request(app)
                .post("/employee/register")
                .send(createdTestEmployee);

            const response = await request(app)
                .post("/employee/register")
                .send(createdTestEmployee);

            expect(response.status).toBe(400);

            expect(response.body.errors).toBeDefined();
        });

        it("should return 400 if name is missing", async () => {
            const { name: _name, ...employeeWithoutName } = createdTestEmployee;
            const response = await request(app)
                .post("/employee/register")
                .send(employeeWithoutName);
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it("should return 400 if password is missing", async () => {
            const { password: _password, ...employeeWithoutPassword } =
                createdTestEmployee;
            const response = await request(app)
                .post("/employee/register")
                .send(employeeWithoutPassword);
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it("should return 400 if hireDate is missing", async () => {
            const { hireDate: _hireDate, ...employeeWithoutHireDate } =
                createdTestEmployee;
            const response = await request(app)
                .post("/employee/register")
                .send(employeeWithoutHireDate);
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it("should return 400 if roleId is missing or invalid (non-existent)", async () => {
            const { roleId: _roleId, ...employeeWithoutRole } =
                createdTestEmployee;
            const responseMissing = await request(app)
                .post("/employee/register")
                .send(employeeWithoutRole);
            expect(responseMissing.status).toBe(400);
            expect(responseMissing.body.errors).toBeDefined();

            const responseInvalid = await request(app)
                .post("/employee/register")
                .send({ ...createdTestEmployee, roleId: 999999 });
            expect(responseInvalid.status).toBe(400);
            expect(responseInvalid.body.errors).toBeDefined();
        });
    });

    describe("POST /employee/login", () => {
        beforeEach(async () => {
            const employeeRepository = AppDataSource.getRepository(Employee);
            await employeeRepository
                .delete({ employeeEmail: createdTestEmployee.employeeEmail })
                .catch(() => {});
            await request(app)
                .post("/employee/register")
                .send(createdTestEmployee);
        });

        afterEach(async () => {
            const employeeRepository = AppDataSource.getRepository(Employee);
            await employeeRepository
                .delete({ employeeEmail: createdTestEmployee.employeeEmail })
                .catch(() => {});
        });

        it("should return 401 for invalid password", async () => {
            const response = await request(app).post("/employee/login").send({
                employeeEmail: createdTestEmployee.employeeEmail,
                password: "WrongPassword123!",
            });

            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
        });

        it("should return 401 for non-existent email", async () => {
            const response = await request(app).post("/employee/login").send({
                employeeEmail: "nonexistent@example.com",
                password: createdTestEmployee.password,
            });
            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
        });

        it("should return 401 for missing employeeEmail", async () => {
            const response = await request(app).post("/employee/login").send({
                password: createdTestEmployee.password,
            });

            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
        });

        it("should return 401 for missing password", async () => {
            const response = await request(app).post("/employee/login").send({
                employeeEmail: createdTestEmployee.employeeEmail,
            });

            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe("POST /employee/refresh-token", () => {
        let refreshToken: string;

        beforeEach(async () => {
            const employeeRepository = AppDataSource.getRepository(Employee);
            await employeeRepository
                .delete({ employeeEmail: createdTestEmployee.employeeEmail })
                .catch(() => {});
            await request(app)
                .post("/employee/register")
                .send(createdTestEmployee);
            const loginResponse = await request(app)
                .post("/employee/login")
                .send({
                    employeeEmail: createdTestEmployee.employeeEmail,
                    password: createdTestEmployee.password,
                });
            refreshToken = loginResponse.body.refreshToken;
        });

        afterEach(async () => {
            const employeeRepository = AppDataSource.getRepository(Employee);
            await employeeRepository
                .delete({ employeeEmail: createdTestEmployee.employeeEmail })
                .catch(() => {});
        });

        it("should return 400 when no token is provided", async () => {
            const response = await request(app)
                .post("/employee/refresh-token")
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toEqual("Refresh token is required.");
        });

        it("should return 401 for invalid refresh token", async () => {
            const response = await request(app)
                .post("/employee/refresh-token")
                .send({ token: "definitely-not-a-valid-token" });

            expect(response.status).toBe(401);
            expect(response.body.error).toBeDefined();
        });
    });
});
