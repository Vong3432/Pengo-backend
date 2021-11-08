import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookingItem from 'App/Models/BookingItem';
import Coupon from 'App/Models/Coupon';
import CouponClientService from 'App/Services/coupon/CouponClientService';
import { DBTransactionService } from 'App/Services/db/DBTransactionService';
import GoocardLogService from 'App/Services/goocard/GoocardLogService';
import GooCardService from 'App/Services/goocard/GooCardService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';
import CreatePaymentValidator from 'App/Validators/CreatePaymentValidator';

export default class PaymentsController {
    public async store(contract: HttpContextContract) {
        const { response, request, auth } = contract;
        const trx = await DBTransactionService.init()
        try {
            const pengoo = await auth.authenticate()
            await pengoo.load('goocard')

            let coupon: Coupon | null = null

            const { booking_item_id, target_holder_id, coupon_id } = await request.validate(CreatePaymentValidator)
            const bookingItem = await BookingItem.findOrFail(booking_item_id);

            let price = bookingItem.price

            if (coupon_id) {
                coupon = await CouponClientService.findById(coupon_id, auth)

                price = price - (price * coupon.discountPercentage / 100)
            }

            console.log("price: ", price, bookingItem.price)

            const intent = await GooCardService.pay(price * 100, target_holder_id, auth);

            await trx.commit()

            return SuccessResponse({ response, data: intent })
        } catch (error) {
            console.log(error)
            await trx.rollback()
            return ErrorResponse({ response, msg: error.messages || error })
        }
    }
}
