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
        const pengoo = await auth.authenticate()
        await pengoo.load('goocard')
        const goocard = pengoo.goocard

        const coupon = await goocard.related('coupons')
            .query()
            .wherePivot('coupon_id', id)
            .wherePivot('goocard_id', goocard.id)
            .firstOrFail()

        return coupon;
    };

    async findAll(contract: HttpContextContract): Promise<Coupon[]> {
        const { auth } = contract;
        const pengoo = await auth.authenticate()
        await pengoo.load('goocard')
        const goocard = pengoo.goocard

        return await goocard.related('coupons').query()
    }

    async create(contract: HttpContextContract): Promise<Coupon> {
        const trx = await DBTransactionService.init();
        try {
            const { auth, request } = contract;

            const pengoo = await auth.authenticate()
            await pengoo.load('goocard')
            const goocard = pengoo.goocard
            const coupon = await this.findById(request.param('id'), auth);

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