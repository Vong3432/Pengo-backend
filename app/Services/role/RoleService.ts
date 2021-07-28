import Role, { Roles } from "App/Models/Role";

export class RoleService {

    roleRepository: any;

    constructor({ roleRepository }) {
        this.roleRepository = roleRepository;
    }

    async findRole(roleName: Roles): Promise<Role> {
        return await this.roleRepository.findByName(roleName);
    }
}