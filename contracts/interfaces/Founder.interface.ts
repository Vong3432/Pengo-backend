import User from "App/Models/User";
import { OpaqueTokenContract } from "@ioc:Adonis/Addons/Auth";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Penger from "App/Models/Penger";

export default interface FounderInterface {
    createFounder(contract: HttpContextContract): Promise<{
        user: User,
        token: OpaqueTokenContract<User>
    }>;
    createPenger(contact: HttpContextContract): Promise<Penger>;
    updatePenger(contact: HttpContextContract): Promise<Penger>;
}