import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DBTransactionService } from "../db/DBTransactionService";
import { BookingRecordClientInterface } from "Contracts/interfaces/BookingRecord.interface";
import BookingRecord from "App/Models/BookingRecord";
import CreateBookingValidator from "App/Validators/pengoo/CreateBookingValidator";
import BookingItemService from "./BookingItemService";
import GooCardService from "../goocard/GooCardService";
import LogInterface, { LogMsg, LogType } from "Contracts/interfaces/Log.interface";
import DateConvertHelperService from "../helpers/DateConvertHelperService";
import GoocardLogService from "../goocard/GoocardLogService";
import { GoocardLogType } from "App/Models/GooCardLog";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";

class BookingRecordClientService implements BookingRecordClientInterface, LogInterface<BookingRecord> {

    async toLog(data: BookingRecord, type: LogType): Promise<LogMsg> {
        await data.load('item');
        const body = await DateConvertHelperService
            .fromDateToReadableText(Date.now(), {
                dateStyle: 'full',
                timeStyle: 'medium'
            });

        switch (type) {
            case "GET":
                return {
                    title: `Booked ${data.item.name} successfully`,
                    body: body,
                    type: GoocardLogType.PASS
                }
            case "USE":
                return {
                    title: `Used ${data.item.name}`,
                    body: body,
                    type: GoocardLogType.PASS
                }
        }
    }

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

    async findById(id: number, auth: AuthContract) {
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

            // save booking record log
            await GoocardLogService.saveLog(
                await this.toLog(record, "GET"),
                auth
            )

            await trx.commit();
            return record;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

    async update({ request, auth }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const id = request.param('id');
            const record = await this.findById(id, auth);

            // update booking_record
            await record.merge({
                isUsed: 1
            }).useTransaction(trx).save()

            await trx.commit()

            // save the verified log
            await GoocardLogService.saveLog(
                await this.toLog(record, "USE"),
                auth
            )
        } catch (error) {
            await trx.rollback();
            throw error;
        }

    };

    async delete({ }: HttpContextContract) {

    };
}

export default new BookingRecordClientService();
