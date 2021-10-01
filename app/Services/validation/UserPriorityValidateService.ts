import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import IValidateItemInterface from "Contracts/interfaces/IValidateItem.interface";
import { ValidateMsg } from "Contracts/interfaces/IValidateItemMsgFormatter.interface";
import { string } from '@ioc:Adonis/Core/Helpers'
import CheckPriorityConditionService from "../priority/CheckPriorityConditionService";
import ValidateItemMsgService from "./ValidateItemMsgService";
import BookingItemClientService from "../booking/BookingItemClientService";

class UserPriorityValidateService implements IValidateItemInterface {
    async validate(itemId: number, auth: AuthContract): Promise<ValidateMsg[]> {

        // Store all validate msg
        const messages: ValidateMsg[] = [];

        // Current user
        const user = await auth.authenticate()

        // Item
        const item = await BookingItemClientService.findById(itemId)
        await item.load('priorityOption', q => q.preload('dpoCol'))

        // HasOne relationship
        // The defined priority option columns from current item
        const dpoCol = item.priorityOption.dpoCol;

        const valFromDB = user[string.camelCase(dpoCol.column)]
        const isInPriority = CheckPriorityConditionService
            .validateCondition(
                valFromDB.toString(),
                item.priorityOption.value,
                item.priorityOption.conditions
            )

        if (!isInPriority) messages.push(ValidateItemMsgService.toValidateMsg("priority", "You are not in the priority", false))
        return messages;

    }

}

export default new UserPriorityValidateService()