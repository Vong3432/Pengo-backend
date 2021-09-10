import { ActionsAuthorizerContract } from "@ioc:Adonis/Addons/Bouncer";
import UnAuthorizedException from "App/Exceptions/UnAuthorizedException";
import User from "App/Models/User";

export const VerifyAdminService = {
    isAdmin: async (bouncer: ActionsAuthorizerContract<User>) => {
        if (await bouncer.with('AdminPolicy').denies('isAdmin')) {
            throw UnAuthorizedException;
        }
    },
}
