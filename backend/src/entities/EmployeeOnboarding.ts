import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Onboarding } from "./Onboarding";
import { Employee } from "./Employee";

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
