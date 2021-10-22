import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Penger from 'App/Models/Penger';
import { PengerVerifyAuthorizationService } from 'App/Services/PengerVerifyAuthorizationService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';
import PengerService from 'App/Services/users/PengerService';

export default class BankAccountsController {
    public async store(contract: HttpContextContract) {
        const { response, request, bouncer } = contract;
        try {
            const { penger_id: pengerId } = request.qs();

            if (!pengerId) {
                throw "Penger id is missing.";
            }

            const penger = await Penger.findByOrFail('id', pengerId);

            // verify
            await PengerVerifyAuthorizationService.isPenger(bouncer);
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

            const intent = await PengerService.setupBankAccount(penger);
            return SuccessResponse({ response, data: intent })
        } catch (error) {
            return ErrorResponse({ response, msg: error.messages || error })
        }
    }
}
