import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DBTransactionService } from "../DBTransactionService";
import CouponInterface from "Contracts/interfaces/Coupon.interface";
import { PengerVerifyAuthorizationService } from "../PengerVerifyAuthorizationService";
import Penger from "App/Models/Penger";
import Coupon from "App/Models/Coupon";
import CreateCouponValidator from "App/Validators/penger/CreateCouponValidator";
import UpdateCouponValidator from "App/Validators/penger/UpdateCouponValidator";
import { DateTime } from "luxon";
import BoolConvertHelperService from "../helpers/BoolConvertHelperService";

class CouponService implements CouponInterface {

    constructor() {

    }

    async findAll(contract: HttpContextContract) {
        return await Coupon.all()
    };

    async findAllByPenger({ request, bouncer }: HttpContextContract) {
        try {
            const pengerId = request.qs().penger_id;
            const pageNum = request.qs().page || 1;
            const type = request.qs().type;

            if (!pengerId) {
                throw "Penger id is missing.";
            }
            const penger = await Penger.findByOrFail('id', pengerId);

            // verify
            await PengerVerifyAuthorizationService.isPenger(bouncer);
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

            const query = penger.related('coupons').query();
            const formatted = DateTime.now().setLocale('zh').toLocaleString();

            if (type === "expired") {
                query.where('valid_to', '<=', formatted)
            } else {
                query.where('valid_to', '>=', formatted)
            }

            return await query.paginate(pageNum)
        } catch (error) {
            throw error;
        }
    };

    async findById(id: number) {
        return await Coupon.findOrFail(id);
    };

    async findByIdAndPenger({ request, bouncer }: HttpContextContract) {
        const pengerId = request.qs().penger_id;
        const id = request.param('id')
        if (!pengerId) {
            throw "Penger id is missing.";
        }
        const penger = await Penger.findByOrFail('id', pengerId);

        // verify
        await PengerVerifyAuthorizationService.isPenger(bouncer);
        await PengerVerifyAuthorizationService.isRelated(bouncer, penger);
        return await penger
            .related('coupons')
            .query()
            .where('id', id)
            .preload('bookingItems')
            .firstOrFail();
    };

    async create({ request, bouncer }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const payload = await request.validate(CreateCouponValidator);
            console.log(payload)
            const { penger_id, only_to_items, ...data } = payload

            const pengerId = penger_id;
            if (!pengerId) {
                throw "Penger id is missing.";
            }
            const penger = await Penger.findByOrFail('id', pengerId);

            // verify
            await PengerVerifyAuthorizationService.isPenger(bouncer);
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

            // coupon
            const coupon = new Coupon();
            coupon.fill({
                ...data,
                isRedeemable: BoolConvertHelperService.boolToInt(payload.is_redeemable) ?? 0,
            });
            await penger.useTransaction(trx).related('coupons').save(coupon);

            await coupon.related('bookingItems').sync(only_to_items ?? []);

            await trx.commit();
            await coupon.load('bookingItems');
            return coupon;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

    async update({ request, bouncer }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const payload = await request.validate(UpdateCouponValidator);
            const { only_to_items, ...data } = payload;

            const pengerId = request.qs().penger_id;
            const couponId = request.param('id');

            const penger = await Penger.findByOrFail('id', pengerId);

            // verify
            await PengerVerifyAuthorizationService.isPenger(bouncer);
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

            // coupon
            const coupon = await penger.related('coupons').query().where('id', couponId).firstOrFail();

            await coupon.related('bookingItems').sync(only_to_items ?? []);

            await coupon.useTransaction(trx).merge({
                ...data,
                isRedeemable: BoolConvertHelperService.boolToInt(payload.is_redeemable) ?? coupon.isRedeemable,
            }).save();

            await trx.commit();

            await coupon.load('bookingItems');
            return coupon;
        } catch (error) {
            await trx.rollback();
            throw error;
        }

    };

    async delete({ }: HttpContextContract) {

    };
}

export default new CouponService()