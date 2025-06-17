import { AppDataSource } from "../../../../config/ormconfig";
import { Role } from "../../../../entities/employee/Role";
import { Repository } from "typeorm";

export class RoleRepository {
    private repository: Repository<Role>;

    constructor() {
        this.repository = AppDataSource.getRepository(Role);
    }

    async findOneByTitle(title: string): Promise<Role | null> {
        return this.repository.findOne({ where: { title } });
    }

    async findOneByRoleId(roleId: number): Promise<Role | null> {
        return this.repository.findOne({ where: { roleId } });
    }

    async findOneWithEmployees(roleId: number): Promise<Role | null> {
        return this.repository.findOne({
            where: { roleId },
            relations: ["employees"],
        });
    }

    async findAll(): Promise<Role[]> {
        return this.repository.find();
    }

    async save(role: Role): Promise<Role> {
        return this.repository.save(role);
    }

    async delete(roleId: number): Promise<void> {
        await this.repository.delete(roleId);
    }
}
