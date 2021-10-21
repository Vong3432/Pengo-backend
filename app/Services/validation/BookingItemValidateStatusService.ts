import BookingItem from "App/Models/BookingItem";
import IValidateItemInterface from "Contracts/interfaces/IValidateItem.interface";
import { ValidateMsg } from "Contracts/interfaces/IValidateItemMsgFormatter.interface";
import { DateTime } from "luxon";
import DateCheckHelperService from "../helpers/DateCheckHelperService";
import ValidateItemMsgService from "./ValidateItemMsgService";

class BookingItemValidateStatusService implements IValidateItemInterface {
    async validate(itemId: number): Promise<ValidateMsg[]> {

        const item = await BookingItem.findOrFail(itemId);
        const messages: ValidateMsg[] = [];
        let isOverEndAt = false;

        // Get endAt from item and convert to ISO format
        if (item.endAt) {
            const itemEndIso = item.endAt.toISO()

            // Get current dt and convert to ISO
            const currentIso = DateTime.now().toISO()

            isOverEndAt = DateCheckHelperService.isCurrentOverTargetISO({ targetIso: itemEndIso, currentIso })
        }

        // Check if booking item is too late to book
        // Item is inactive
        const isActive = item.isActive === 1
        // Item is out of stock
        const isOutOfStock = item.quantity === 0 && item.isCountable === 1;

        messages.push(ValidateItemMsgService.toValidateMsg("active", `This item is ${isActive ? "opened" : "not opened"} for booking`, isActive))
        messages.push(ValidateItemMsgService.toValidateMsg("quantity", `This item is ${isOutOfStock ? "out of" : "in"} stocked`, !isOutOfStock))
        messages.push(ValidateItemMsgService.toValidateMsg("endAt", `This item ${!isOverEndAt ? "is still opened to booked" : "can no longer be booked"}`, !isOverEndAt))

        return messages;
    };

}

export default new BookingItemValidateStatusService()