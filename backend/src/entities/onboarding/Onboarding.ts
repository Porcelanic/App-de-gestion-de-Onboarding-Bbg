import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from "typeorm";
import { OnboardingType } from "./OnboardingType";
import { EmployeeOnboarding } from "../employeeOnboarding/EmployeeOnboarding";

@Entity()
export class Onboarding {
    @PrimaryGeneratedColumn()
    onboardingId!: number;

    @Column({ length: 255 })
    name!: string;

    @Column({ type: "date" })
    startDate!: Date;

    @Column({ type: "date" })
    endDate!: Date;

    @Column()
    typeId!: number;

    @ManyToOne(
        () => OnboardingType,
        (onboardingType) => onboardingType.onboardings
    )
    @JoinColumn({ name: "typeId" })
    onboardingType!: OnboardingType;

    @OneToMany(
        () => EmployeeOnboarding,
        (employeeOnboarding) => employeeOnboarding.onboarding
    )
    employeeOnboardings!: EmployeeOnboarding[];
}
