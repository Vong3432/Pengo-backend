import User from "App/Models/User";
import { RequestContract } from "@ioc:Adonis/Core/Request";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import { OpaqueTokenContract } from "@ioc:Adonis/Addons/Auth";
import { ActionsAuthorizerContract } from "@ioc:Adonis/Addons/Bouncer";

export default interface FounderInterface {
    createFounder(request: RequestContract, auth: AuthContract): Promise<{
        user: User,
        token: OpaqueTokenContract<User>
    }>;
    createPenger(request: RequestContract, auth: AuthContract, bouncer: ActionsAuthorizerContract<User>);
}