import { AppDataSource } from "../../../../../config/ormconfig";
import { OnboardingType } from "../../../../../entities/OnboardingType";
import { Repository } from "typeorm";

export class OnboardingTypeRepository {
    private repository: Repository<OnboardingType>;

    constructor() {
        this.repository = AppDataSource.getRepository(OnboardingType);
    }

    async findOneByName(name: string): Promise<OnboardingType | null> {
        return this.repository.findOne({ where: { name } });
    }

    async findOneByTypeId(typeId: number): Promise<OnboardingType | null> {
        return this.repository.findOne({ where: { typeId } });
    }

    async findOneWithOnboardings(
        typeId: number
    ): Promise<OnboardingType | null> {
        return this.repository.findOne({
            where: { typeId },
            relations: ["onboardings"],
        });
    }

    async findAll(): Promise<OnboardingType[]> {
        return this.repository.find();
    }

    async save(onboardingType: OnboardingType): Promise<OnboardingType> {
        return this.repository.save(onboardingType);
    }

    async delete(typeId: number): Promise<void> {
        await this.repository.delete(typeId);
    }
}
