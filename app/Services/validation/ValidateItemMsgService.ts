import IValidateItemMsgFormatterInterface, { ValidateMsg } from "Contracts/interfaces/IValidateItemMsgFormatter.interface";

class ValidateItemMsgService implements IValidateItemMsgFormatterInterface {
    toValidateMsg(key: string, formattedMsg: string, pass: boolean): ValidateMsg {
        return {
            key,
            formattedMsg,
            pass
        }
    };

}

export default new ValidateItemMsgService()