import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DBTransactionService } from "../db/DBTransactionService";
import BookingRecordInterface from "Contracts/interfaces/BookingRecord.interface"
import Penger from "App/Models/Penger";
import { PengerVerifyAuthorizationService } from "../PengerVerifyAuthorizationService";
import BookingRecord from "App/Models/BookingRecord";
import { DateTime } from "luxon";

class BookingRecordService implements BookingRecordInterface {

    async findAll({ request, bouncer }: HttpContextContract) {
        const { penger_id, show_expired, show_today } = request.qs()

        const penger = await Penger.query()
            .where('id', penger_id)
            .firstOrFail()
        await PengerVerifyAuthorizationService.isPenger(bouncer);
        await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

        const records = await BookingRecord
            .query()
            .where('penger_id', penger.id)
            .where('is_used', 0)
            .preload('item')
            .preload('goocard', q => q.preload('user'))

        const shouldShowExpired = show_expired == 1
        const showToday = show_today == 1
        const sortedRecords = this.sortBookDate(records, shouldShowExpired, showToday)

        return sortedRecords
    };

    async getTodayRecordsStat({ request, bouncer }: HttpContextContract) {
        const { penger_id } = request.qs()

        const penger = await Penger.query()
            .where('id', penger_id)
            .firstOrFail()
        await PengerVerifyAuthorizationService.isPenger(bouncer);
        await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

        const records = await BookingRecord
            .query()
            .where('penger_id', penger.id)
            .where('is_used', 0)

        const sortedRecords = this.sortBookDate(records, false, true)

        return sortedRecords.length
    }

    formatRecordProperties(record: BookingRecord) {
        const serialized = record.serialize()

        return {
            ...serialized, // destructure existing properties
        }
    }

    private sortBookDate(arr: BookingRecord[], showExpired: boolean, showToday: boolean) {
        return arr
            .map(record => this.formatRecordProperties(record))
            .filter((record) => {
                if (showToday) {
                    const today = DateTime.now().setLocale('zh').toISO();
                    // return record if today is between startdate and enddate
                    return (today >= record['book_date']['start_date']) && (today <= record['book_date']['end_date'])
                } else {
                    if (!showExpired) {
                        const today = DateTime.now().setLocale('zh').toISO();
                        return record['book_date']['end_date'] >= today; // return when booking is not expired yet
                    }
                }
                return record
            })
            .sort((a, b) => {
                let aDate = a['book_date']['start_date'] ?? a['book_date']['end_date'];
                let bDate = b['book_date']['start_date'] ?? b['book_date']['end_date'];

                if (aDate > bDate) {
                    return 1
                } else if (aDate < bDate) {
                    return -1
                }

                return 0
            })
    }

    async findById(id: number, { request, bouncer }: HttpContextContract) {
        const { penger_id } = request.qs()

        const penger = await Penger.query()
            .where('id', penger_id)
            .firstOrFail()
        await PengerVerifyAuthorizationService.isPenger(bouncer);
        await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

        const record = await BookingRecord.findOrFail(id);
        await record.load('item')
        await record.load('goocard', q => q.preload('user'))

        return record;
    };

    async create({ }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {

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

export default new BookingRecordService()