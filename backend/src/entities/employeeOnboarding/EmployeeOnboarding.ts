import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Onboarding } from "../onboarding/Onboarding";
import { Employee } from "../employee/Employee";

@Entity()
export class EmployeeOnboarding {
    @PrimaryColumn()
    onboardingId!: number;

    @PrimaryColumn()
    employeeEmail!: string;

    @Column({ default: false })
    done!: boolean;

    @ManyToOne(() => Onboarding, (onboarding) => onboarding.employeeOnboardings)
    @JoinColumn({ name: "onboardingId" })
    onboarding!: Onboarding;

    @ManyToOne(() => Employee, (employee) => employee.employeeOnboardings)
    @JoinColumn({ name: "employeeEmail" })
    employee!: Employee;
}
