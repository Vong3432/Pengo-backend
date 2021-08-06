import User from "App/Models/User";
import { RequestContract } from "@ioc:Adonis/Core/Request";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import { OpaqueTokenContract } from "@ioc:Adonis/Addons/Auth";

export default interface PengooInterface {
    createPengoo(request: RequestContract, auth: AuthContract): Promise<{ user: User, token: OpaqueTokenContract<User> }>;
}