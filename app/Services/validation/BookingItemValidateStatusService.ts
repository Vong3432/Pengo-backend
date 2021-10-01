import IValidateItemInterface from "Contracts/interfaces/IValidateItem.interface";
import { ValidateMsg } from "Contracts/interfaces/IValidateItemMsgFormatter.interface";
import { DateTime } from "luxon";
import BookingItemClientService from "../booking/BookingItemClientService";
import DateCheckHelperService from "../helpers/DateCheckHelperService";
import ValidateItemMsgService from "./ValidateItemMsgService";

class BookingItemValidateStatusService implements IValidateItemInterface {
    async validate(itemId: number): Promise<ValidateMsg[]> {

        const item = await BookingItemClientService.findById(itemId);
        const messages: ValidateMsg[] = [];

        // Get endAt from item and convert to ISO format
        const itemEndIso = item.endAt.toISO()

        // Get current dt and convert to ISO
        const currentIso = DateTime.now().toISO()

        // Check if booking item is too late to book
        const isOverEndAt = DateCheckHelperService.isCurrentOverTargetISO({ targetIso: itemEndIso, currentIso })

        // Item is inactive
        if (!item.isActive) messages.push(ValidateItemMsgService.toValidateMsg("active", "This item is opened for booking", false))
        // Item is out of stock
        if (item.quantity === 0 && item.isCountable) messages.push(ValidateItemMsgService.toValidateMsg("quantity", "This item is out of stocked", false))
        // Too late to book item
        if (isOverEndAt) messages.push(ValidateItemMsgService.toValidateMsg("endAt", "This item can no longer be booked", false))

        return messages;
    };

}

export default new BookingItemValidateStatusService()