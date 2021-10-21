import { AuthContract } from "@ioc:Adonis/Addons/Auth"
import { ValidateMsg } from "Contracts/interfaces/IValidateItemMsgFormatter.interface"
import UserBookingValidateInterface, { UserBookValidateResponse } from "Contracts/interfaces/UserBookingValidate.interface"
import BookingItemValidateStatusService from "./BookingItemValidateStatusService"
import UserPriorityValidateService from "./UserPriorityValidateService";
import ValidateItemMsgService from "./ValidateItemMsgService";

class UserBookingValidateService implements UserBookingValidateInterface {
    async validate(itemId: number, auth: AuthContract): Promise<UserBookValidateResponse> {

        // user is not logged in
        if (!await auth.authenticate()) {
            return {
                msg: [ValidateItemMsgService.toValidateMsg("auth", "You must login for booking", false)],
                bookable: false,
            }
        }

        try {
            const itemValidatedMessages = await BookingItemValidateStatusService.validate(itemId);
            const priorityValidatedMessages = await UserPriorityValidateService.validate(itemId, auth);
            const allValidatedMessages = itemValidatedMessages.concat(priorityValidatedMessages)

            let bookable: boolean = true;

            // throw msg instead of sending a 200 status response
            allValidatedMessages.map((msg) => {
                if (!msg.pass) {
                    bookable = false
                }
            })
            return {
                msg: allValidatedMessages,
                bookable: bookable,
            }
        } catch (error) {
            throw error
        }
    }
}

export default new UserBookingValidateService()