import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BookingCategory from "App/Models/BookingCategory";
import Penger from "App/Models/Penger";
import CreateBookingCategoryValidator from "App/Validators/penger/CreateBookingCategoryValidator";
import BookingCategoryInterface from "Contracts/interfaces/BookingCategory.interface";
import { DBTransactionService } from "../DBTransactionService";
import { PengerVerifyAuthorizationService } from "../PengerVerifyAuthorizationService";

export class BookingCategoryService implements BookingCategoryInterface {

    constructor() {

    }

    async findAll({ request }: HttpContextContract) {
        const pengerId = request.qs().penger_id;

        if (pengerId)
            return await BookingCategory.query().where('created_by', pengerId)

        return await BookingCategory.all();
    };

    async findAllByPenger({ request, response, bouncer }: HttpContextContract) {
        const pengerId = request.qs().penger_id;
        const pageNum = request.qs().page || 1;

        if (!pengerId) {
            throw "Penger id is missing.";
        }

        const penger = await Penger.findByOrFail('id', pengerId);

        // verify
        await PengerVerifyAuthorizationService.isPenger(bouncer);
        await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

        // get
        const bookingCategories = await penger.related('bookingCategories').query().preload('bookingItems');
        return bookingCategories;
    }

    async findById(id: number) {
        return await BookingCategory.find(id);
    };

    async findByIdAndPenger({ request, bouncer }: HttpContextContract) {
        const { penger_id: pengerId } = request.qs();
        const categoryId = request.param('id');

        if (!pengerId) {
            throw "Penger id is missing.";
        }

        const penger = await Penger.findByOrFail('id', pengerId);

        // verify
        await PengerVerifyAuthorizationService.isPenger(bouncer);
        await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

        return await BookingCategory.findByOrFail('id', categoryId);
    };

    async create({ request, bouncer }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const payload = await request.validate(CreateBookingCategoryValidator);
            const penger = await Penger.findByOrFail('id', payload.penger_id);

            // verify
            await PengerVerifyAuthorizationService.isPenger(bouncer);
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

            const bookingCategory = new BookingCategory();
            // set transaction
            bookingCategory.useTransaction(trx);

            // set data
            bookingCategory.fill({ name: payload.name });

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
            const { name, penger_id: pengerId, is_enable } = request.body();
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

            await bookingCategory.useTransaction(trx).merge({ name, isEnable: is_enable || bookingCategory.isEnable }).save();
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