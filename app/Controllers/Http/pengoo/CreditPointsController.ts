import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreditPointsClientService from 'App/Services/credit_points/CreditPointsClientService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';

export default class CreditPointsController {
    async store(contract: HttpContextContract) {
        const { response } = contract;
        try {
            const { credit, amount } = await CreditPointsClientService.add(contract);
            return SuccessResponse({ response, data: credit, msg: `Redeemed ${amount} credit points` })
        } catch (error) {
            return ErrorResponse({ response, msg: error })
        }
    }
}
