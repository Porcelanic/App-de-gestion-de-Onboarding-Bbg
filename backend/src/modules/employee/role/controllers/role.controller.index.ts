import { RoleController } from "./role.controller";
import { RoleService } from "../services/role.service";
import { RoleRepository } from "../repositories/role.repository";

const roleRepository = new RoleRepository();
const roleService = new RoleService(roleRepository);
const roleController = new RoleController(roleService);

export { roleController };
