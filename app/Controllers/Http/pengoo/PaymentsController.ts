import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookingItem from 'App/Models/BookingItem';
import GooCardService from 'App/Services/goocard/GooCardService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';
import CreatePaymentValidator from 'App/Validators/CreatePaymentValidator';

export default class PaymentsController {
    public async store(contract: HttpContextContract) {
        const { response, request, auth } = contract;
        try {
            // "to" refers to penger since this is client side paymentController.
            const { booking_item_id, target_holder_id } = await request.validate(CreatePaymentValidator)
            const bookingItem = await BookingItem.findOrFail(booking_item_id);

            const intent = await GooCardService.pay(bookingItem.price * 100, target_holder_id, auth);
            return SuccessResponse({ response, data: intent })
        } catch (error) {
            console.log(error)
            return ErrorResponse({ response, msg: error.messages || error })
        }
    }
}
