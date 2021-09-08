import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DBTransactionService } from "../DBTransactionService";
import { BookingRecordClientInterface } from "Contracts/interfaces/BookingRecord.interface";
import BookingRecord from "App/Models/BookingRecord";
import CreateBookingValidator from "App/Validators/pengoo/CreateBookingValidator";
import BookingItemService from "./BookingItemService";
import GooCardService from "../goocard/GooCardService";

class BookingRecordClientService implements BookingRecordClientInterface {

    async findAll({ auth }: HttpContextContract) {
        try {
            const user = await auth.authenticate();
            await user.load('goocard');
            const records = await BookingRecord
                .query()
                .where('goocard_id', user.goocard.id)
                .preload('item')
                .orderBy('book_date')
                .orderBy('book_time');

            return records;
        } catch (error) {
            throw error;
        }
    };

    async findById(id: number, { auth }: HttpContextContract) {
        try {
            const user = await auth.authenticate();
            await user.load('goocard');
            const item = await BookingRecord
                .query()
                .preload('item')
                .where('id', id)
                .where('goocard_id', user.goocard.id)
                .firstOrFail();
            return item;
        } catch (error) {
            throw error
        }
    };

    async create({ request, auth }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const user = await auth.authenticate();
            const payload = await request.validate(CreateBookingValidator);

            const card = await GooCardService.verify(payload.pin, user.id);
            await BookingItemService.findById(payload.booking_item_id);

            const record = new BookingRecord();
            await record.useTransaction(trx).fill({
                gooCardId: card.id,
                pengerId: payload.penger_id,
                bookDate: payload.book_date,
                bookTime: payload.book_time,
                bookingItemId: payload.booking_item_id,
            }).save();

            await trx.commit();
            return record;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

    async update({ }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {

        } catch (error) {
            await trx.rollback();
            throw error;
        }

    };

    async delete({ }: HttpContextContract) {

    };
}

export default new BookingRecordClientService();
