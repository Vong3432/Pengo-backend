import User from "App/Models/User";
import { OpaqueTokenContract } from "@ioc:Adonis/Addons/Auth";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default interface FounderInterface {
    createFounder(contract: HttpContextContract): Promise<{
        user: User,
        token: OpaqueTokenContract<User>
    }>;
    createPenger(contact: HttpContextContract);
}