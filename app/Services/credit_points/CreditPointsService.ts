import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CreditPointsInterface from "Contracts/interfaces/CreditPoints.interface"
import CreditPoint from "App/Models/CreditPoint";
import AddCreditPointValidator from "App/Validators/pengoo/AddCreditPointValidator";
import BookingItem from "App/Models/BookingItem";
import BookingRecord from "App/Models/BookingRecord";
import DeductCreditPointValidator from "App/Validators/pengoo/DeductCreditPointValidator";
import Coupon from "App/Models/Coupon";
import InsufficientCreditPointException from "App/Exceptions/InsufficientCreditPointException";
import BookingRecordClientService from "../booking/BookingRecordClientService";
import CouponService from "../coupon/CouponService";

class CreditPointsService implements CreditPointsInterface {
    async add(contract: HttpContextContract): Promise<{
        credit: CreditPoint,
        amount: number
    }> {
        const { request, auth } = contract;
        try {
            const payload = await request.validate(AddCreditPointValidator)

            // get record
            const record: BookingRecord = await BookingRecordClientService.findById(payload.record_id, contract);

            // validate record is already scanned and verified.
            if (record.isUsed === 0) throw 'Unable to add credit points'

            await record.load('item');
            const item: BookingItem = record.item;

            const user = await auth.authenticate();
            await user.load('goocard');

            const credit = await CreditPoint.firstOrCreate({
                gooCardId: user.goocard.id,
                pengerId: record.pengerId,
            }, {
                totalCreditPoints: 0,
                availableCreditPoints: 0
            });

            if (credit.$isLocal) {
                // is new
                credit.merge({
                    totalCreditPoints: item.creditPoints,
                    availableCreditPoints: item.creditPoints,
                });
                await user.goocard.related('creditPoints').save(credit);
            } else {
                // exist
                await credit.merge({
                    totalCreditPoints: credit.totalCreditPoints + item.creditPoints,
                    availableCreditPoints: credit.availableCreditPoints + item.creditPoints,
                }).save();
            }

            return {
                credit,
                amount: item.creditPoints
            };
        } catch (error) {
            throw new Error("Failed to add credit points");
        }
    }

    async deduct(contract: HttpContextContract): Promise<{
        credit: CreditPoint,
        amount: number
    }> {
        const { request, auth } = contract;
        try {
            const payload = await request.validate(DeductCreditPointValidator)

            // get coupon
            const coupon: Coupon = await CouponService.findById(payload.coupon_id);

            // get record
            const record: BookingRecord = await BookingRecordClientService.findById(payload.record_id, contract);

            // validate user has sufficient credit points
            const user = await auth.authenticate();
            await user.load('goocard');

            const credit = await CreditPoint.query()
                .where('goocard_id', user.goocard.id)
                .where('penger_id', record.pengerId)
                .firstOrFail()

            if (credit.availableCreditPoints === 0 ||
                credit.availableCreditPoints < coupon.minCreditPoints)
                throw InsufficientCreditPointException

            // exist
            await credit.merge({
                availableCreditPoints: credit.availableCreditPoints - coupon.minCreditPoints,
            }).save();

            return {
                credit,
                amount: coupon.minCreditPoints
            };
        } catch (error) {
            throw error;
        }
    }

}

export default new CreditPointsService();
