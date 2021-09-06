import { Exception } from '@adonisjs/core/build/standalone'
import { ErrorResponse } from 'App/Services/ResponseService'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new InsufficientCreditPointException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class InsufficientCreditPointException extends Exception {
    public async handle(error: this, ctx: HttpContextContract) {
        ErrorResponse({ response: ctx.response, code: error.status, msg: 'You dont have sufficient credit points to perform this action.' })
    }
}
