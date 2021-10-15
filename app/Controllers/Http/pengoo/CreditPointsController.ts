import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreditPointsClientService from 'App/Services/credit_points/CreditPointsClientService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';

export default class CreditPointsController {
    async store(contract: HttpContextContract) {
        const { request, auth, response } = contract;
        try {
            const { credit, amount } = await CreditPointsClientService.add(request.body().record_id, auth);
            return SuccessResponse({ response, data: credit, msg: `Redeemed ${amount} credit points` })
        } catch (error) {
            return ErrorResponse({ response, msg: error })
        }
    }
}
