import User from "App/Models/User";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { OpaqueTokenContract } from "@ioc:Adonis/Addons/Auth";

export default interface PengooInterface {
    createPengoo(contract: HttpContextContract): Promise<{ user: User, token: OpaqueTokenContract<User> }>;
}