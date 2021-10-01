import { AuthContract } from "@ioc:Adonis/Addons/Auth"
import { ValidateMsg } from "Contracts/interfaces/IValidateItemMsgFormatter.interface"
import UserBookingValidateInterface from "Contracts/interfaces/UserBookingValidate.interface"
import BookingItemValidateStatusService from "./BookingItemValidateStatusService"
import UserPriorityValidateService from "./UserPriorityValidateService";
import ValidateItemMsgService from "./ValidateItemMsgService";

class UserBookingValidateService implements UserBookingValidateInterface {
    async validate(itemId: number, auth: AuthContract): Promise<ValidateMsg[]> {

        // user is not logged in
        if (!await auth.authenticate()) return [ValidateItemMsgService.toValidateMsg("auth", "You must login for booking", false)];

        try {
            const itemValidatedMessages = await BookingItemValidateStatusService.validate(itemId);
            const priorityValidatedMessages = await UserPriorityValidateService.validate(itemId, auth);
            const allValidatedMessages = itemValidatedMessages.concat(priorityValidatedMessages)

            return allValidatedMessages;
        } catch (error) {
            throw error
        }
    }
}

export default new UserBookingValidateService()