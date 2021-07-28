import GooCard from "App/Models/GooCard";
import Role, { Roles } from "App/Models/Role";

export const roleRepository = {

    async findByName(roleName: Roles): Promise<Role | any> {
        try {
            const role = await Role.findByOrFail('name', roleName);
            return role;
        } catch (error) {
            throw "Something went wrong"
        }
    },

}
