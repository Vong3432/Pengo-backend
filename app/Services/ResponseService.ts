import { ResponseContract } from '@ioc:Adonis/Core/Response';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Response } from '@adonisjs/core/build/standalone';

interface ISuccessRes {
    response: ResponseContract,
    code?: number;
    msg?: string;
    data?: any;
}
interface IErrorRes {
    response: ResponseContract,
    code?: number;
    msg: string;
    data?: any;
}

/** 
 * @description Returns formatted success json (Normally is used in controllers and custom exceptions)
 * @example SuccessResponse({response, code: 200, msg: "Success!", data: {a: "ab"}})
 * @returns \{ msg: "Some success message" }
 * @returns \{ msg: "Some success message", data: someData }
*/
export const SuccessResponse = ({ response, code, msg, data }: ISuccessRes) => {
    return response.status(code || 200).json({ msg, data })
}

/** 
 * @description Returns formatted error json (Normally is used in controllers and custom exceptions)
 * @example ErrorResponse({response, code: 500, msg: "Fail!"})
 * @returns \{ msg: "Some error message" }
*/
export const ErrorResponse = ({ response, code, msg, data }: IErrorRes) => {
    // console.log("ERRRES", msg)
    // return response.status(code || 500).json({ msg: msg && Object.keys(msg).length === 0 ? "Error occured." : msg })
    return response.status(code || 500).json({ msg: msg.toString() ?? "Error occured", data })
}