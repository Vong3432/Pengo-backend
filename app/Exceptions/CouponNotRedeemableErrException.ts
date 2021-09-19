import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse } from 'App/Services/ResponseService'
/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new CouponNotRedeemableErrException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class CouponNotRedeemableErrException extends Exception {
    public async handle(error: this, ctx: HttpContextContract) {
        ErrorResponse({ response: ctx.response, code: error.status, msg: error.message })
    }
}
