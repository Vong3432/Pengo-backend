import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DBTransactionService } from "../db/DBTransactionService";
import BookingRecordInterface from "Contracts/interfaces/BookingRecord.interface"
import Penger from "App/Models/Penger";
import { PengerVerifyAuthorizationService } from "../PengerVerifyAuthorizationService";
import BookingRecord from "App/Models/BookingRecord";
import { DateTime } from "luxon";
import GooCard from "App/Models/GooCard";
import BookingRecordClientService from "./BookingRecordClientService";
import GooCardLog from "App/Models/GooCardLog";
import CreditPoint from "App/Models/CreditPoint";
import BookingItem from "App/Models/BookingItem";

class BookingRecordService implements BookingRecordInterface {

    async findAll({ request, bouncer }: HttpContextContract) {
        const { penger_id, show_expired, show_today } = request.qs()

        const penger = await Penger.query()
            .where('id', penger_id)
            .firstOrFail()
        await PengerVerifyAuthorizationService.isPenger(bouncer);
        await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

        const shouldShowExpired = show_expired == 1
        const showToday = show_today == 1

        const records = await BookingRecord
            .query()
            .where('penger_id', penger.id)
            .if(shouldShowExpired === false, q => q.where('is_used', 0))
            .preload('item')
            .preload('goocard', q => q.preload('user'))

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

        // format and concate `current` user record
        const formattedBookTime = DateTime.fromFormat(record.bookTime, "h:mm a").toFormat("HH:mm")
        const formattedStartDate = DateTime.fromISO(record.serialize()['book_date']['start_date']).toFormat('yyyy-MM-dd') + " " + formattedBookTime
        const concatDT = DateTime.fromFormat(formattedStartDate, "yyyy-MM-dd HH:mm")

        return {
            ...serialized, // destructure existing properties
            formatted_book_datetime: concatDT,
        }
    }

    private sortBookDate(arr: BookingRecord[], showExpired: boolean, showToday: boolean) {
        return arr
            .map(record => this.formatRecordProperties(record))
            .filter((record) => {
                if (showToday) {
                    const todayDT: DateTime = DateTime.now().toLocal()
                    const startDT = DateTime.fromISO(record['book_date']['start_date'])
                    const endDT = DateTime.fromISO(record['book_date']['end_date'])

                    const diffFromStart = todayDT.diff(startDT, ['days']).days
                    const diffFromEnd = todayDT.diff(endDT, ['days']).days

                    // return record if today is between startdate and enddate
                    const isBetween = diffFromStart >= 0 && diffFromEnd <= 0 || (todayDT.hasSame(startDT, 'day') && todayDT.hasSame(endDT, 'day'))

                    return isBetween
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

    /**
     * 
     * @description Approve/verify pengoo pass manually
     */
    async update({ request }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const pengerId = request.qs().penger_id
            const record = await BookingRecord
                .query()
                .where('penger_id', pengerId)
                .where('id', request.param('id'))
                .firstOrFail()
            const item = await BookingItem.findOrFail(record.bookingItemId)

            if (record.isUsed === 1) {
                return "Already verified"
            }

            // update record
            await record.useTransaction(trx).merge({ isUsed: 1 }).save()

            // save logs for pengoo
            const card = await GooCard.findByOrFail('id', record.gooCardId)
            await card.load('user')

            const { title, body, type } = await BookingRecordClientService.toLog(record, "USE");

            const log = new GooCardLog()
            log.fill({
                title,
                body,
                type
            })

            await card.related('logs').save(log);

            // update credit points
            const credit = await CreditPoint.firstOrCreate({
                gooCardId: card.id,
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
                await card.related('creditPoints').save(credit);
            } else {
                // exist
                await credit.merge({
                    totalCreditPoints: credit.totalCreditPoints + item.creditPoints,
                    availableCreditPoints: credit.availableCreditPoints + item.creditPoints,
                }).save();
            }

            // commit
            await trx.commit()

        } catch (error) {
            await trx.rollback();
            throw error;
        }

    };

    /**
     * 
     * @description Only pengoo can cancel
     */
    async delete({ request }: HttpContextContract) {
    };

}

export default new BookingRecordService()