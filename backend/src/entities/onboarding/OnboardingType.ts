import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Onboarding } from "./Onboarding";

@Entity()
export class OnboardingType {
    @PrimaryGeneratedColumn()
    typeId!: number;

    @Column({ length: 255, unique: true })
    name!: string;

    @Column("text")
    description!: string;

    @OneToMany(() => Onboarding, (onboarding) => onboarding.onboardingType)
    onboardings!: Onboarding[];
}
