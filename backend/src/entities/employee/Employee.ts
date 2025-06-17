import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from "typeorm";
import { Role } from "./Role";
import { EmployeeOnboarding } from "../employeeOnboarding/EmployeeOnboarding";

@Entity()
export class Employee {
    @PrimaryColumn({ length: 255 })
    employeeEmail!: string;

    @Column({ length: 255 })
    name!: string;

    @Column({ length: 255 })
    password!: string;

    @Column({ type: "date" })
    hireDate!: Date;

    @Column({ type: "date", nullable: true })
    terminationDate?: Date;

    @Column()
    roleId!: number;

    @ManyToOne(() => Role, (role) => role.employees)
    @JoinColumn({ name: "roleId" })
    role!: Role;

    @OneToMany(
        () => EmployeeOnboarding,
        (employeeOnboarding) => employeeOnboarding.employee
    )
    employeeOnboardings!: EmployeeOnboarding[];
}
