import { ValidateMsg } from "./IValidateItemMsgFormatter.interface";

export type ValidateParam = (
    itemId: number,
    options?: {}
) => Promise<ValidateMsg[]>

export default interface IValidateItemInterface {
    validate: ValidateParam;
}

