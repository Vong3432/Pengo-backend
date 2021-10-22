import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Penger from 'App/Models/Penger';
import GooCardService from 'App/Services/goocard/GooCardService';
import { PengerVerifyAuthorizationService } from 'App/Services/PengerVerifyAuthorizationService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';
import PengerService from 'App/Services/users/PengerService';
import CreatePaymentValidator from 'App/Validators/CreatePaymentValidator';

export default class PaymentsController {
    // public async store(contract: HttpContextContract) {
    //     const { response, request, bouncer } = contract;
    //     try {
    //         // "to" refers to penger since this is client side paymentController.
    //         const { amount, target_holder_id } = await request.validate(CreatePaymentValidator)
    //         const { penger_id: pengerId } = request.qs();

    //         if (!pengerId) {
    //             throw "Penger id is missing.";
    //         }

    //         const penger = await Penger.findByOrFail('id', pengerId);

    //         // verify
    //         await PengerVerifyAuthorizationService.isPenger(bouncer);
    //         await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

    //         const intent = await PengerService.pay(amount, target_holder_id, penger);
    //         return SuccessResponse({ response, data: intent })
    //     } catch (error) {
    //         return ErrorResponse({ response, msg: error.messages || error })
    //     }
    // }
}
