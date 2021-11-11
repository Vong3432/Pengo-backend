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
import GooCardLog, { GoocardLogType } from "App/Models/GooCardLog";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import { DateTime } from "luxon";
import Penger from "App/Models/Penger";
import PengerService from "../core/PengerService";
import CouponClientService from "../coupon/CouponClientService";
import Coupon from "App/Models/Coupon";

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

    async findAll({ auth, request }: HttpContextContract) {
        const { limit, category, date, is_used } = request.qs()
        try {
            const user = await auth.authenticate();
            await user.load('goocard');
            const records = await BookingRecord
                .query()
                .if(limit, (q) => q.limit(limit))
                .if(is_used, q => q.where('is_used', is_used))
                .where('goocard_id', user.goocard.id)
                .preload('item', q => {
                    if (category) {
                        q.preload('category')
                    }
                })
                .orderBy('book_date')
                .orderBy('book_time');

            const notOverRecords = records.filter((record) => {
                const todayDT: DateTime = DateTime.now().toLocal()

                const formattedBookTime = DateTime.fromFormat(record.bookTime, "h:mm a").toFormat("HH:mm")
                const formattedStartDate = DateTime.fromISO(record.serialize()['book_date']['start_date']).toFormat('yyyy-MM-dd') + " " + formattedBookTime
                const formattedEndDate = DateTime.fromISO(record.serialize()['book_date']['end_date']).toFormat('yyyy-MM-dd') + " " + formattedBookTime
                const concatStartDT = DateTime.fromFormat(formattedStartDate, "yyyy-MM-dd HH:mm")
                const concatEndDT = DateTime.fromFormat(formattedEndDate, "yyyy-MM-dd HH:mm")

                const { seconds: startSec } = concatStartDT.diff(todayDT, ['seconds']).toObject()
                const { seconds: endSec } = concatEndDT.diff(todayDT, ['seconds']).toObject()
                const isSecondsOver = startSec! < 0 && endSec! < 0
                const isOver = isSecondsOver
                // filter this record out if is over already
                return !isOver
            })

            if (date) {
                const filteredDateRecords = notOverRecords.filter((record) => {
                    const itemStartDate: DateTime = DateTime.fromISO(JSON.parse(record.bookDate)["start_date"])
                    const itemEndDate: DateTime = DateTime.fromISO(JSON.parse(record.bookDate)["end_date"])

                    const requestedDate = DateTime.fromISO(date).toLocal()
                    const diffFromStart = requestedDate.diff(itemStartDate, ['days']).days
                    const diffFromEnd = requestedDate.diff(itemEndDate, ['days']).days

                    const isInBetween = diffFromStart >= 0 && diffFromEnd <= 0

                    return isInBetween
                });

                return filteredDateRecords;
            }
            return notOverRecords;
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
            await user.load('goocard')
            const payload = await request.validate(CreateBookingValidator);

            const penger = await Penger.findOrFail(payload.penger_id)

            const startDate = payload.book_date?.start_date?.toSQLDate()
            const endDate = payload.book_date?.end_date?.toSQLDate()


            if (await PengerService.isOpen(penger, startDate, endDate) === false) {
                const moment = startDate !== null && endDate !== null ? `between ${startDate} until ${endDate}` : "at the moment"
                throw Error(`${penger.name} is closed ${moment}`)
            }

            const card = await GooCardService.verify(payload.pin, user.id);
            const item = await BookingItemService.findById(payload.booking_item_id);

            const record = new BookingRecord();

            await record.useTransaction(trx).fill({
                gooCardId: card.id,
                pengerId: payload.penger_id,
                bookDate: JSON.stringify(payload.book_date),
                bookTime: payload.book_time,
                bookingItemId: payload.booking_item_id,
                rewardPoint: item.creditPoints,
                isUsed: 0,
            }).save();

            // if has coupon
            if (payload.coupon_id != null) {
                const coupon: Coupon = await CouponClientService.findById(payload.coupon_id, auth)
                // save used coupon log
                await GoocardLogService.saveLog(
                    await CouponClientService.toLog(coupon, "USE"),
                    auth
                )

                // Update is_used in `goocard_coupon` pivot table
                await user.goocard.useTransaction(trx).related('coupons').sync({
                    [coupon.id]: {
                        is_used: true
                    }
                }, false)
            }

            // save booking record log
            const returnedLog: GooCardLog | Error = await GoocardLogService.saveLog(
                await this.toLog(record, "GET"),
                auth
            )

            await trx.commit();
            return {
                ...record.serialize(),
                log: returnedLog
            }
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
            // await record.merge({
            //     isUsed: 1
            // }).useTransaction(trx).save()

            // save the verified log
            await GoocardLogService.saveLog(
                await this.toLog(record, "USE"),
                auth
            )

            await trx.commit()

        } catch (error) {
            await trx.rollback();
            throw error;
        }

    };

    async delete({ request, auth }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const id = request.param('id');
            const user = await auth.authenticate();
            await user.load('goocard');
            const record = await BookingRecord
                .query()
                .preload('item')
                .where('id', id)
                .where('goocard_id', user.goocard.id)
                .where('is_used', 0)
                .firstOrFail();

            await record.delete()
            await trx.commit()
        } catch (error) {
            await trx.rollback()
            throw error;
        }
    };

    async getRecordByPengooAndItem(bookingItemId: number, gooCardId: number) {
        return await BookingRecord.query()
            .where('goocard_id', gooCardId)
            .where('booking_item_id', bookingItemId)
    }

}

export default new BookingRecordClientService();
