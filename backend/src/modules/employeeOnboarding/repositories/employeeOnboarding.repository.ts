import { AppDataSource } from "../../../config/ormconfig";
import { EmployeeOnboarding } from "../../../entities/employeeOnboarding/EmployeeOnboarding";
import { Repository, FindOptionsWhere } from "typeorm";

export class EmployeeOnboardingRepository {
    private repository: Repository<EmployeeOnboarding>;

    constructor() {
        this.repository = AppDataSource.getRepository(EmployeeOnboarding);
    }

    async findOneByCompositeKey(
        onboardingId: number,
        employeeEmail: string
    ): Promise<EmployeeOnboarding | null> {
        return this.repository.findOne({
            where: { onboardingId, employeeEmail },
        });
    }

    async findOneByCompositeKeyWithRelations(
        onboardingId: number,
        employeeEmail: string
    ): Promise<EmployeeOnboarding | null> {
        return this.repository.findOne({
            where: { onboardingId, employeeEmail },
            relations: ["onboarding", "employee", "onboarding.onboardingType"],
        });
    }

    async findByOnboardingId(
        onboardingId: number
    ): Promise<EmployeeOnboarding[]> {
        return this.repository.find({
            where: { onboardingId },
            relations: ["employee"],
        });
    }

    async findByEmployeeEmail(
        employeeEmail: string
    ): Promise<EmployeeOnboarding[]> {
        return this.repository.find({
            where: { employeeEmail },
            relations: ["onboarding", "onboarding.onboardingType"],
        });
    }

    async findAll(
        loadRelations: boolean = false
    ): Promise<EmployeeOnboarding[]> {
        if (loadRelations) {
            return this.repository.find({
                relations: [
                    "onboarding",
                    "employee",
                    "onboarding.onboardingType",
                ],
            });
        }
        return this.repository.find();
    }

    async save(
        employeeOnboarding: EmployeeOnboarding
    ): Promise<EmployeeOnboarding> {
        return this.repository.save(employeeOnboarding);
    }

    async deleteByCompositeKey(
        onboardingId: number,
        employeeEmail: string
    ): Promise<void> {
        await this.repository.delete({ onboardingId, employeeEmail });
    }

    async count(where: FindOptionsWhere<EmployeeOnboarding>): Promise<number> {
        return this.repository.count({ where });
    }
}
