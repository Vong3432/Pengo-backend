import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import { ValidateMsg } from "./IValidateItemMsgFormatter.interface";

export type UserBookValidateResponse = {
    msg: ValidateMsg[],
    bookable: boolean,
}

export default interface UserBookingValidateInterface {
    validate(itemId: number, auth?: AuthContract): Promise<UserBookValidateResponse>
}
