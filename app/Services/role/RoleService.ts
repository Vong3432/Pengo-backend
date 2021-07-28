import Role, { Roles } from "App/Models/Role";
import { roleRepository } from "App/Repositories/RoleRepository";

type Repository = typeof roleRepository;

export class RoleService {

    roleRepository: Repository;

    constructor({ roleRepository }) {
        this.roleRepository = roleRepository;
    }

    async findRole(roleName: Roles): Promise<Role> {
        return await this.roleRepository.findByName(roleName);
    }
}