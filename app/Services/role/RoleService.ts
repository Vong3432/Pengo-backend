import Role, { Roles } from "App/Models/Role";
import RoleInterface from "Contracts/interfaces/Role.interface";
class RoleService implements RoleInterface {

    async findRole(roleName: Roles): Promise<Role> {
        try {
            const role = await Role.findByOrFail('name', roleName);
            return role;
        } catch (error) {
            throw "Something went wrong"
        }
    }
}

export default new RoleService();
