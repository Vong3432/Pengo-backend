import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BookingCategory from "App/Models/BookingCategory";
import Penger from "App/Models/Penger";
import CreateBookingCategoryValidator from "App/Validators/penger/CreateBookingCategoryValidator";
import BookingCategoryInterface from "Contracts/interfaces/BookingCategory.interface";
import SystemFunctionService from "../admin/SystemFunctionService";
import { DBTransactionService } from "../db/DBTransactionService";
import BoolConvertHelperService from "../helpers/BoolConvertHelperService";
import { PengerVerifyAuthorizationService } from "../PengerVerifyAuthorizationService";

class BookingCategoryService implements BookingCategoryInterface {
    async findAll({ request }: HttpContextContract) {
        const pengerId = request.qs().penger_id;

        if (pengerId)
            return await BookingCategory.query().where('created_by', pengerId)

        return await BookingCategory.query().where('is_enable', 1).preload('createdBy');
    };

    async findAllByPenger({ request, bouncer }: HttpContextContract) {
        const pengerId = request.qs().penger_id;

        if (!pengerId) {
            throw "Penger id is missing.";
        }

        const penger = await Penger.findByOrFail('id', pengerId);

        // verify
        await PengerVerifyAuthorizationService.isPenger(bouncer);
        await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

        // get
        const bookingCategories = await penger.related('bookingCategories').query();
        return bookingCategories;
    }

    async findById(id: number) {
        return await BookingCategory.findOrFail(id);
    };

    async findByIdAndPenger(contract: HttpContextContract) {
        const { request, bouncer } = contract;

        const { penger_id: pengerId } = request.qs();
        const categoryId = request.param('id');

        if (!pengerId) {
            throw "Penger id is missing.";
        }

        const penger = await Penger.findByOrFail('id', pengerId);

        // verify
        await PengerVerifyAuthorizationService.isPenger(bouncer);
        await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

        const category = await this.findById(categoryId)
        await category.load('bookingOptions', q => q.pivotColumns(['is_enable', 'created_at', 'updated_at']))

        const systemFunctions = await SystemFunctionService.findAll(contract);

        return {
            ...category.serialize(),
            system_functions: systemFunctions
        }
    };

    async create({ request, bouncer }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const payload = await request.validate(CreateBookingCategoryValidator);
            const penger = await Penger.findByOrFail('id', request.qs().penger_id);

            console.log("qs", request.qs().penger_id)

            // verify
            await PengerVerifyAuthorizationService.isPenger(bouncer);
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

            const bookingCategory = new BookingCategory();
            // set transaction
            bookingCategory.useTransaction(trx);

            // set data
            bookingCategory.fill({ name: payload.name, isEnable: BoolConvertHelperService.boolToInt(payload.is_enable) ?? 1 });

            // bind relation
            await penger.related('bookingCategories').save(bookingCategory);
            await trx.commit();

            return bookingCategory;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

    async update({ request, bouncer }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const { name, is_enable } = request.body();
            const { penger_id: pengerId } = request.qs();
            const categoryId = request.param('id');

            if (!pengerId) {
                throw "Penger id is missing";
            }

            const penger = await Penger.findByOrFail('id', pengerId);

            // verify
            await PengerVerifyAuthorizationService.isPenger(bouncer);
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

            // get
            const bookingCategory = await BookingCategory.findByOrFail('id', categoryId);

            await bookingCategory.useTransaction(trx).merge({ name, isEnable: is_enable ?? bookingCategory.isEnable }).save();
            await trx.commit();

            return bookingCategory;
        } catch (error) {
            await trx.rollback();
            throw error;
        }

    };

    async delete({ }: HttpContextContract) {

    };
}

export default new BookingCategoryService();