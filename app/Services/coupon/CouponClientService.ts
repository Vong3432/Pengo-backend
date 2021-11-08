import CouponClientInterface from "Contracts/interfaces/CouponClient.interface"
import Coupon from "App/Models/Coupon";
import LogInterface, { LogType, LogMsg } from "Contracts/interfaces/Log.interface";
import DateConvertHelperService from "../helpers/DateConvertHelperService";
import GoocardLogService from "../goocard/GoocardLogService";
import { DBTransactionService } from "../db/DBTransactionService";
import { GoocardLogType } from "App/Models/GooCardLog";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import CouponValidateService from "./CouponValidateService";
import CouponNotRedeemableErrException from "App/Exceptions/CouponNotRedeemableErrException";
import CreditPointsClientService from "../credit_points/CreditPointsClientService";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CreditPoint from "App/Models/CreditPoint";
import CouponService from "./CouponService";
import { DateTime } from "luxon";
import User from "App/Models/User";
import Role, { Roles } from "App/Models/Role";
import BookingItem from "App/Models/BookingItem";

class CouponClientService implements CouponClientInterface, LogInterface<Coupon>  {

    async toLog(data: Coupon, type: LogType): Promise<LogMsg> {
        const body = await DateConvertHelperService
            .fromDateToReadableText(Date.now(), {
                dateStyle: 'full',
                timeStyle: 'medium'
            });

        switch (type) {
            case "GET":
                return {
                    title: `Redeemed ${data.title} successfully`,
                    body: body,
                    type: GoocardLogType.COUPON
                }
            case "USE":
                return {
                    title: `Used ${data.title}`,
                    body: body,
                    type: GoocardLogType.COUPON
                }
        }
    }

    async findById(id: number, auth: AuthContract) {

        const coupon = await Coupon.findOrFail(id);
        await coupon.load('bookingItems')
        await coupon.load('penger')
        await coupon.penger.load('location')

        return coupon
    };

    async findAll(contract: HttpContextContract): Promise<Coupon[]> {
        const { auth, request } = contract;
        const { active, redeemed, expired } = request.qs()
        const pengoo = await auth.authenticate()
        await pengoo.load('goocard')

        if (active == 1) {
            // get all credit points current user
            const histories = await CreditPoint
                .query()
                .where('goocard_id', pengoo.goocard.id)
            // grab penger ids of all previously booked penger
            const pengerIds = histories.map((v) => v.pengerId)

            await pengoo.goocard.load('coupons');
            const redeemedCouponIds = pengoo.goocard.coupons.map(c => c.id)

            const coupons = await Coupon.query()
                .whereIn(['created_by', 'is_redeemable'], [[pengerIds, 1]])
                .whereNotIn('id', redeemedCouponIds)
                .where('quantity', '>', 0)
                .where('valid_to', '>=', DateTime.now().toISO())

            return coupons;
        }

        if (redeemed == 1 || expired == 1) {
            await pengoo.goocard
                .load('coupons', q => {
                    if (expired == 1)
                        q.where('valid_to', '<', DateTime.now().toISO())
                    if (redeemed == 1)
                        q.where('is_used', 0)
                });
            return pengoo.goocard.coupons
        }

        return []
    }

    async create(contract: HttpContextContract): Promise<Coupon> {
        const trx = await DBTransactionService.init();
        try {
            const { auth, request } = contract;

            const pengoo = await auth.authenticate()
            await pengoo.load('goocard')
            const goocard = pengoo.goocard
            const coupon = await this.findById(request.qs().id, auth);

            if (!CouponValidateService.canRedeemed(coupon))
                throw new CouponNotRedeemableErrException("This coupon cannot be redeemed.")

            await CreditPointsClientService.deduct(coupon.minCreditPoints, coupon.pengerId, auth)

            // update coupon quantity
            await coupon.merge({
                quantity: coupon.quantity > 0 ? coupon.quantity - 1 : 0
            })
                .useTransaction(trx)
                .save();

            await trx.commit();

            // save to `goocard_coupon`
            await goocard.related('coupons').save(coupon);

            // save coupon record log
            await GoocardLogService.saveLog(await this.toLog(coupon, "GET"), auth)

            return coupon;

        } catch (error) {
            await trx.rollback()
            throw error
        }
    }

    update(contract: HttpContextContract): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async delete(contract: HttpContextContract): Promise<Coupon> {
        const trx = await DBTransactionService.init();
        try {
            const { auth, request } = contract;

            const couponId = request.param('id');
            const pengoo = await auth.authenticate()
            await pengoo.load('goocard')

            const goocard = pengoo.goocard

            // Update is_used in `goocard_coupon` pivot table
            await goocard.useTransaction(trx).related('coupons').sync({
                [couponId]: {
                    is_used: true
                }
            }, false)

            await trx.commit()

            // save used coupon log
            const coupon = await this.findById(couponId, auth)
            await GoocardLogService.saveLog(
                await this.toLog(coupon, "USE"),
                auth
            )

            return coupon;
        } catch (error) {
            await trx.rollback()
            throw error
        }
    }

}

export default new CouponClientService()