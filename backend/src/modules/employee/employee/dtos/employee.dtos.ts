export interface RegisterResult {
    errors?: string[];
    user?: {
        employeeEmail: string;
    };
}

export interface LoginResult {
    errors?: string[];
    tokens?: {
        accessToken: string;
        refreshToken: string;
        name: string;
        employeeEmail: string;
    };
}

export interface RefreshTokenResult {
    accessToken?: string;
    error?: string;
}

export interface EmployeeDto {
    employeeEmail: string;
    name: string;
    hireDate: Date;
    terminationDate?: Date;
    roleId: number;
    roleTitle?: string;
}

export interface GetAllEmployeesResult {
    employees?: EmployeeDto[];
    errors?: string[];
}

export interface GetEmployeeByEmailResult {
    employee?: EmployeeDto;
    errors?: string[];
}

export interface UpdateEmployeeResult {
    employee?: EmployeeDto;
    errors?: string[];
}

export interface DeleteEmployeeResult {
    success?: boolean;
    errors?: string[];
}

export interface CreateEmployeeDto {
    employeeEmail: string;
    name: string;
    password: string;
    hireDate: Date;
    terminationDate?: Date;
    roleId: number;
}

export interface UpdateEmployeeDto {
    name?: string;
    password?: string;
    hireDate?: Date;
    terminationDate?: Date;
    roleId?: number;
}

export interface LoginEmployeeDto {
    employeeEmail: string;
    password: string;
}
