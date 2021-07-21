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
}

export const SuccessResponse = ({ response, code, msg, data }: ISuccessRes) => {
    return response.status(code || 200).json({ msg, data })
}

export const ErrorResponse = ({ response, code, msg }: IErrorRes) => {
    return response.status(code || 500).json({ msg })
}