import { OpaqueTokenContract } from "@ioc:Adonis/Addons/Auth";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import { RequestContract } from "@ioc:Adonis/Core/Request";
import User from "App/Models/User";

export default interface AuthInterface {
    login(request: RequestContract, auth: AuthContract): Promise<{
        user: User,
        token: OpaqueTokenContract<User>
    }>;
    loginPenger(request: RequestContract, auth: AuthContract): Promise<{
        user: User,
        token: OpaqueTokenContract<User>
    }>;
}