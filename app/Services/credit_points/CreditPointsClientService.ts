import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CreditPointsInterface from "Contracts/interfaces/CreditPoints.interface"
import CreditPoint from "App/Models/CreditPoint";
import AddCreditPointValidator from "App/Validators/pengoo/AddCreditPointValidator";
import BookingItem from "App/Models/BookingItem";
import BookingRecord from "App/Models/BookingRecord";
import InsufficientCreditPointException from "App/Exceptions/InsufficientCreditPointException";
import BookingRecordClientService from "../booking/BookingRecordClientService";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";

class CreditPointsService implements CreditPointsInterface {
    async add(contract: HttpContextContract): Promise<{
        credit: CreditPoint,
        amount: number
    }> {
        const { request, auth } = contract;
        try {
            const payload = await request.validate(AddCreditPointValidator)

            // get record
            const record: BookingRecord = await BookingRecordClientService.findById(payload.record_id, auth);

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

    // This deduct() function can only be called internally via other service classes.
    async deduct(amount: number, pengerId: number, auth: AuthContract): Promise<{
        credit: CreditPoint,
        amount: number
    }> {
        try {

            // validate user has sufficient credit points
            const user = await auth.authenticate();
            await user.load('goocard');

            const credit = await CreditPoint.query()
                .where('goocard_id', user.goocard.id)
                .where('penger_id', pengerId)
                .firstOrFail()

            if (credit.availableCreditPoints === 0 ||
                credit.availableCreditPoints < amount)
                throw new InsufficientCreditPointException("You don't have enought credit points to redeem coupon under this penger.")

            // exist
            await credit.merge({
                availableCreditPoints: credit.availableCreditPoints - amount,
            }).save();

            return {
                credit,
                amount
            };
        } catch (error) {
            throw error;
        }
    }

}

export default new CreditPointsService();
