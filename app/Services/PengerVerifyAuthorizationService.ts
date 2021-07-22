import { ActionsAuthorizerContract } from "@ioc:Adonis/Addons/Bouncer";
import UnAuthorizedPengerException from "App/Exceptions/UnAuthorizedPengerException";
import Penger from "App/Models/Penger";
import User from "App/Models/User";

export const PengerVerifyAuthorizationService = {
    isPenger: async (bouncer: ActionsAuthorizerContract<User>) => {
        if (await bouncer.with('UserPolicy').denies('isPenger')) {
            throw new UnAuthorizedPengerException('You are not authorized to perform this action', 403, 'E_UNAUTHORIZED')
        }
    },
    isRelated: async (bouncer: ActionsAuthorizerContract<User>, penger: Penger) => {
        if (await bouncer.with('UserPolicy').denies('canPerformActionOnPenger', penger)) {
            throw new UnAuthorizedPengerException('You are not authorized to this Penger', 403, 'E_UNAUTHORIZED')
        }
    }
}
