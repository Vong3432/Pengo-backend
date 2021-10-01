import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import { ValidateMsg } from "./IValidateItemMsgFormatter.interface";

export default interface UserBookingValidateInterface {
    validate(itemId: number, auth?: AuthContract): Promise<ValidateMsg[]>
}
