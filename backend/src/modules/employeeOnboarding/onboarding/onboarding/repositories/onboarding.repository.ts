import { AppDataSource } from "../../../../../config/ormconfig";
import { Onboarding } from "../../../../../entities/Onboarding";
import { Repository } from "typeorm";

export class OnboardingRepository {
    private repository: Repository<Onboarding>;

    constructor() {
        this.repository = AppDataSource.getRepository(Onboarding);
    }

    async findOneById(onboardingId: number): Promise<Onboarding | null> {
        return this.repository.findOne({ where: { onboardingId } });
    }

    async findOneByName(name: string): Promise<Onboarding | null> {
        return this.repository.findOne({ where: { name } });
    }

    async findOneByIdWithRelations(
        onboardingId: number
    ): Promise<Onboarding | null> {
        return this.repository.findOne({
            where: { onboardingId },
            relations: ["onboardingType", "employeeOnboardings"],
        });
    }

    async findOneByIdWithOnboardingType(
        onboardingId: number
    ): Promise<Onboarding | null> {
        return this.repository.findOne({
            where: { onboardingId },
            relations: ["onboardingType"],
        });
    }

    async findOneByIdWithEmployeeOnboardings(
        onboardingId: number
    ): Promise<Onboarding | null> {
        return this.repository.findOne({
            where: { onboardingId },
            relations: ["employeeOnboardings"],
        });
    }

    async findAll(): Promise<Onboarding[]> {
        return this.repository.find({ relations: ["onboardingType"] });
    }

    async findAllWithRelations(): Promise<Onboarding[]> {
        return this.repository.find({
            relations: ["onboardingType", "employeeOnboardings"],
        });
    }

    async save(onboarding: Onboarding): Promise<Onboarding> {
        return this.repository.save(onboarding);
    }

    async delete(onboardingId: number): Promise<void> {
        await this.repository.delete(onboardingId);
    }
}
