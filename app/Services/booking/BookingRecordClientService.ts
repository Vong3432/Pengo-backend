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
import Sentry from "@ioc:Adonis/Addons/Sentry";
import SimpleMailService from "../mail/SimpleMailService";
import Env from '@ioc:Adonis/Core/Env'

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
                .withAggregate('feedbacks', q => {
                    q.count('*').as('is_reviewed')
                })
                .orderBy('book_date')
                .orderBy('book_time');

            // if is_used is 1, dont do filter 
            const notOverRecords = is_used == 1
                ? records
                : records.filter((record) => {
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

                return filteredDateRecords.map(r => {
                    return {
                        ...r.serialize(),
                        is_reviewed: r.$extras.is_reviewed !== 0
                    }
                });
            }

            return notOverRecords.map(r => {
                return {
                    ...r.serialize(),
                    is_reviewed: r.$extras.is_reviewed !== 0
                }
            })
        } catch (error) {
            Sentry.captureException(error)
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

            if (item.isCountable === 1 && item.quantity !== null) {
                if (item.quantity === 0)
                    throw Error('Out of stocked')

                await item.useTransaction(trx).merge({
                    quantity: item.quantity - 1
                }).save()
            }

            const record = new BookingRecord();

            await record.useTransaction(trx).fill({
                gooCardId: card.id,
                pengerId: payload.penger_id,
                bookDate: JSON.stringify({
                    start_date: payload.book_date?.start_date,
                    end_date: payload.book_date?.end_date ?? payload.book_date?.start_date,
                }),
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

            // send email to penger and pengoo
            SimpleMailService.send({
                email: user.email,
                from: Env.get("SMTP_USER"),
                subject: (returnedLog as GooCardLog).title,
                text: 'Booked successfully',
                html: `
                    <h1>Booked successfully</h1>
                    <p style="font-size: 20px">You have successfully booked ${item.name} at ${record.groupDate}, ${record.bookTime}.</p>
                    <div style="display: flex; flex-flow: row; align-items:center;">
                    <img width="52" height="52" style="border-radius: 14px; object-fit: cover; margin-right: 12px;" src="${item.posterUrl}" />
                    <div>
                    <strong style="font-size:18px; font-weight: bold">${item.name}</strong>
                    <br />
                    <small style="margin-top: 10px">Created from ${penger.name}</small>
                    </div>
                    </div>
                `,
                method: "GET"
            })

            await penger.load('pengerUsers')

            for (const pengerUser of penger.pengerUsers) {
                SimpleMailService.send({
                    email: pengerUser.email,
                    from: Env.get("SMTP_USER"),
                    subject: "Booking notification",
                    text: 'Booked notification',
                    html: `
                        <h1>Booking notification</h1>
                        <p style="font-size: 20px">${user.username} booked ${item.name}</p>
    
                        <div style="display: flex; flex-flow: row; align-items:center;">
                        <img width="52" height="52" style="border-radius: 14px; object-fit: cover; margin-right: 12px;" src="${item.posterUrl}" />
                        <div>
                        <strong style="font-size:18px; font-weight: bold">${item.name}</strong>
                            <br />
                        <small style="margin-top: 10px">${record.groupDate}, ${record.bookTime}</small>
                        </div>
                        </div>
                        <div style="opacity: 0.1; height: 2px; margin: 18px 0; background-color: #000;"  />
                        <div style="display: flex; flex-flow: row; align-items:center;">
                        <img width="32" height="32" style="border-radius: 32px; object-fit: cover; margin-right: 12px;" src="${user.avatar}" />
                        <div>
                        <strong style="font-size:14px; font-weight: bold">${user.username}</strong>
                            <br />
                        <small style="margin-top: 10px">${user.phone}</small>
                        </div>
                        </div>
                    `,
                    method: "GET"
                })
            }

            return {
                ...record.serialize(),
                log: returnedLog
            }
        } catch (error) {
            console.log(error)
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

            const item = await BookingItemService.findById(record.bookingItemId)

            await record.load('penger')
            const penger = record.penger

            if (item.isCountable === 1 && item.quantity !== null) {
                await item.useTransaction(trx).merge({
                    quantity: item.quantity + 1
                }).save()
            }

            await record.delete()

            // send email to penger and pengoo
            SimpleMailService.send({
                email: user.email,
                from: Env.get("SMTP_USER"),
                subject: "Cancel booking successfully",
                text: 'Cancel successfully',
                html: `
                    <h1>Cancel booking successfully</h1>
                    <p style="font-size: 20px">You have cancel your booking for ${item.name} at ${record.groupDate}, ${record.bookTime}.</p>
                    <div style="display: flex; flex-flow: row; align-items:center;">
                    <img width="52" height="52" style="border-radius: 14px; object-fit: cover; margin-right: 12px;" src="${item.posterUrl}" />
                    <div>
                    <strong style="font-size:18px; font-weight: bold">${item.name}</strong>
                    <br />
                    <small style="margin-top: 10px">Created from ${penger.name}</small>
                    </div>
                    </div>
                `,
                method: "GET"
            })

            await penger.load('pengerUsers')

            for (const pengerUser of penger.pengerUsers) {
                SimpleMailService.send({
                    email: pengerUser.email,
                    from: Env.get("SMTP_USER"),
                    subject: "Booking notification",
                    text: 'Cancel booking notification',
                    html: `
                        <h1>Cancel booking notification</h1>
                        <p style="font-size: 20px">${user.username} cancel his booking for ${item.name}</p>
    
                        <div style="display: flex; flex-flow: row; align-items:center;">
                        <img width="52" height="52" style="border-radius: 14px; object-fit: cover; margin-right: 12px;" src="${item.posterUrl}" />
                        <div>
                        <strong style="font-size:18px; font-weight: bold">${item.name}</strong>
                            <br />
                        <small style="margin-top: 10px">${record.groupDate}, ${record.bookTime}</small>
                        </div>
                        </div>
                        <div style="opacity: 0.1; height: 2px; margin: 18px 0; background-color: #000;"  />
                        <div style="display: flex; flex-flow: row; align-items:center;">
                        <img width="32" height="32" style="border-radius: 32px; object-fit: cover; margin-right: 12px;" src="${user.avatar}" />
                        <div>
                        <strong style="font-size:14px; font-weight: bold">${user.username}</strong>
                            <br />
                        <small style="margin-top: 10px">${user.phone}</small>
                        </div>
                        </div>
                    `,
                    method: "GET"
                })
            }

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
