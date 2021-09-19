import Database from '@ioc:Adonis/Lucid/Database';
import Coupon from 'App/Models/Coupon';
import GooCard from 'App/Models/GooCard';
import GooCardLog from 'App/Models/GooCardLog';
import BookingRecordClientService from 'App/Services/booking/BookingRecordClientService';
import CouponClientService from 'App/Services/coupon/CouponClientService';
import DateConvertHelperService from 'App/Services/helpers/DateConvertHelperService';
import { BookingRecordFactory } from 'Database/factories/booking-record';
import { CouponFactory } from 'Database/factories/coupon';
import { UserFactory } from 'Database/factories/user';
import test, { group } from 'japa'

test.group('Testing goocard_log module', (group) => {

    let goocard: GooCard;

    group.before(async () => {
        let user = await UserFactory.with('goocard', 1).create();
        await user.load('goocard');
        goocard = user.goocard;
        // save the current state of db before testing
        await Database.beginGlobalTransaction()
    })

    group.after(async () => {
        // restore db to the state before testing
        await Database.rollbackGlobalTransaction()
    })

    test('Ensure use pass will save log', async (assert) => {
        const user = await UserFactory.with('goocard', 1).create();
        await user.load('goocard')

        const item = await BookingRecordFactory
            .with('item')
            .create();

        const logMsg = await BookingRecordClientService.toLog(item, "USE")
        const { title, body, type } = logMsg;

        const log = new GooCardLog()
        log.fill({
            title,
            body,
            type
        })

        await user.goocard.related('logs').save(log)
        await user.goocard.load('logs')

        const logDB = user.goocard.logs[0]

        assert.deepEqual(logMsg, {
            title: logDB.title,
            body: logDB.body,
            type: logDB.type,
        })
    })

    let cid;

    test('Ensure redeem coupon will save log', async (assert) => {
        const coupon: Coupon = await CouponFactory.create()

        console.log(`Goocard coupon before save: ${await (await goocard.related('coupons').query()).length}`)

        await goocard.related('coupons').save(coupon);
        await goocard.load('coupons')

        console.log(`Goocard coupon after save: ${goocard.coupons.length}`)

        cid = coupon.id;

        const logMsg = await CouponClientService.toLog(coupon, "GET")
        const { title, body, type } = logMsg;

        const log = new GooCardLog()
        log.fill({
            title,
            body,
            type
        })

        await goocard.related('logs').save(log)
        await goocard.load('logs')

        const logDB = goocard.logs[0]

        assert.deepEqual(logMsg, {
            title: logDB.title,
            body: logDB.body,
            type: logDB.type,
        })
    })
    test('Ensure use coupon will save log', async (assert) => {
        await goocard.related('coupons').sync({
            [cid]: {
                is_used: true
            }
        }, false)

        const usedCoupon = await goocard.related('coupons')
            .query()
            .wherePivot('coupon_id', cid)
            .wherePivot('is_used', 1)
            .firstOrFail()

        const logMsg = await CouponClientService.toLog(usedCoupon, "USE")
        const { title, body, type } = logMsg;

        const log = new GooCardLog()
        log.fill({
            title,
            body,
            type
        })

        await goocard.related('logs').save(log)
        await goocard.load('logs')

        const logDB = goocard.logs[goocard.logs.length - 1]

        assert.deepEqual(logMsg, {
            title: logDB.title,
            body: logDB.body,
            type: logDB.type,
        })
    })

})
