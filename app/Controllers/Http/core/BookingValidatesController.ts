import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'
import UserBookingValidateService from 'App/Services/validation/UserBookingValidateService'

export default class BookingValidatesController {
    async getBookingItemValidateStatus({ request, response, auth }: HttpContextContract) {
        try {
            const itemStatusList = await UserBookingValidateService.validate(request.param('id'), auth)
            return SuccessResponse({ response, data: itemStatusList })
        } catch (error) {
            return ErrorResponse({ response, msg: error.messages || error })
        }
    }
}
