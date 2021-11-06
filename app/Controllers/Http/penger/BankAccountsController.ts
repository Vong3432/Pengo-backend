import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Penger from 'App/Models/Penger';
import { PengerVerifyAuthorizationService } from 'App/Services/PengerVerifyAuthorizationService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';
import PengerService from 'App/Services/users/PengerService';

export default class BankAccountsController {
    public async index(contract: HttpContextContract) {
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

            const acc = await PengerService.getBankAccount(contract);
            return SuccessResponse({ response, data: acc })
        } catch (error) {
            return ErrorResponse({ response, msg: error.messages || error })
        }
    }

    public async store(contract: HttpContextContract) {
        const { response, request, bouncer } = contract;
        try {
            const { penger_id: pengerId } = request.qs();
            const { acc_id } = request.body()

            if (!pengerId) {
                throw "Penger id is missing.";
            }

            const penger = await Penger.findByOrFail('id', pengerId);

            // verify
            await PengerVerifyAuthorizationService.isPenger(bouncer);
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

            const intent = await PengerService.setupBankAccount(acc_id, penger);
            return SuccessResponse({ response, data: intent })
        } catch (error) {
            console.log(error)
            return ErrorResponse({ response, msg: "Invalid account id" })
        }
    }

    public async update(contract: HttpContextContract) {
        const { response, request, bouncer } = contract;
        try {
            const { penger_id: pengerId } = request.qs();
            const { acc_id } = request.body()

            if (!pengerId) {
                throw "Penger id is missing.";
            }

            const penger = await Penger.findByOrFail('id', pengerId);

            // verify
            await PengerVerifyAuthorizationService.isPenger(bouncer);
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

            const intent = await PengerService.updateBankAccount(acc_id, penger);
            return SuccessResponse({ response, data: intent })
        } catch (error) {
            console.log(error)
            return ErrorResponse({ response, msg: "Invalid account id" })
        }
    }

}
