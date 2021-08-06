import { OpaqueTokenContract } from "@ioc:Adonis/Addons/Auth";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default interface AuthInterface {
    login(contract: HttpContextContract): Promise<{
        user: User,
        token: OpaqueTokenContract<User>
    }>;
    loginPenger(contract: HttpContextContract): Promise<{
        user: User,
        token: OpaqueTokenContract<User>
    }>;
}