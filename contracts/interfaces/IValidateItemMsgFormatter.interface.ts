export type ValidateMsgFunc = (
    key: string,
    formattedMsg: string,
    pass: boolean // * seems duplicate
) => ValidateMsg

export type ValidateMsg = {
    key: string,
    formattedMsg: string,
    pass: boolean // * seems duplicate
}

export default interface IValidateItemMsgFormatterInterface {
    toValidateMsg: ValidateMsgFunc
}
