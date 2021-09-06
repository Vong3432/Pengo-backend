import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreditPointsService } from 'App/Services/credit_points/CreditPointsService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';

export default class CreditPointsController {

    private readonly service: CreditPointsService = new CreditPointsService();

    async store(contract: HttpContextContract) {
        const { response } = contract;
        try {
            const { credit, amount } = await this.service.add(contract);
            return SuccessResponse({ response, data: credit, msg: `Redeemed ${amount} credit points` })
        } catch (error) {
            return ErrorResponse({ response, msg: error })
        }
    }

    async destroy(contract: HttpContextContract) {
        const { response } = contract;
        try {
            const { credit, amount } = await this.service.deduct(contract);
            return SuccessResponse({ response, data: credit, msg: `${amount} credit points are deducted.` })
        } catch (error) {
            return ErrorResponse({ response, msg: error })
        }
    }
}
