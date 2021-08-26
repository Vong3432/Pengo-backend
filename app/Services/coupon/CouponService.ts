import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DBTransactionService } from "../DBTransactionService";
import CouponInterface from "Contracts/interfaces/Coupon.interface";
import { PengerVerifyAuthorizationService } from "../PengerVerifyAuthorizationService";
import Penger from "App/Models/Penger";
import Coupon from "App/Models/Coupon";
import CreateCouponValidator from "App/Validators/penger/CreateCouponValidator";
import UpdateCouponValidator from "App/Validators/penger/UpdateCouponValidator";

export class CouponService implements CouponInterface {

    constructor() {

    }

    async findAll(_contract: HttpContextContract) {
        return await Coupon.all()
    };

    async findAllByPenger({ request, bouncer }: HttpContextContract) {
        try {
            const pengerId = request.qs().penger_id;
            const pageNum = request.qs().page || 1;

            if (!pengerId) {
                throw "Penger id is missing.";
            }
            const penger = await Penger.findByOrFail('id', pengerId);

            // verify
            await PengerVerifyAuthorizationService.isPenger(bouncer);
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

            return await penger.related('coupons').query().paginate(pageNum);
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

        return await penger.related('coupons').query().where('id', id).firstOrFail();
    };

    async create({ request, bouncer }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const payload = await request.validate(CreateCouponValidator);
            const { penger_id, ...data } = payload

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
            coupon.fill({ ...data });

            await penger.useTransaction(trx).related('coupons').save(coupon);
            await trx.commit();

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
            const { penger_id, ...data } = payload;

            const pengerId = penger_id;
            const couponId = request.param('id');

            if (!pengerId) {
                throw "Penger id is missing.";
            }
            const penger = await Penger.findByOrFail('id', pengerId);

            // verify
            await PengerVerifyAuthorizationService.isPenger(bouncer);
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

            // coupon
            const coupon = await penger.related('coupons').query().where('id', couponId).firstOrFail();
            await coupon.useTransaction(trx).merge({ ...data }).save();

            await trx.commit();
            return coupon;
        } catch (error) {
            await trx.rollback();
            throw error;
        }

    };

    async delete({ }: HttpContextContract) {

    };
}