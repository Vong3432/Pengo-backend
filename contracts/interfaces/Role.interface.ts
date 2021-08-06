import Role from "App/Models/Role";

export default interface RoleInterface {
    findRole(s: String): Promise<Role>;
}