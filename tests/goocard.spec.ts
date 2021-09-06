import Database from '@ioc:Adonis/Lucid/Database';
import GooCardLog from 'App/Models/GooCardLog';
import { DateConvertHelperService } from 'App/Services/helpers/DateConvertHelperService';
import { BookingRecordFactory } from 'Database/factories/booking-record';
import { UserFactory } from 'Database/factories/user';
import test from 'japa'

test.group('Testing booking records module', (group) => {

    group.before(async () => {
        await Database.beginGlobalTransaction()
    })

    group.after(async () => {
        await Database.rollbackGlobalTransaction()
    })

    test('Ensure goocard is linked with new user.', async (assert) => {
        const user = await UserFactory.with('goocard', 1).create();
        assert.isNotEmpty(user.goocard)
    })
    test('Ensure log can be saved', async (assert) => {
        const user = await UserFactory.with('goocard', 1).create();

        const item = await BookingRecordFactory
            .with('item')
            .create();

        const getCurrentTime = await new DateConvertHelperService()
            .fromDateToReadableText(Date.now(), {
                dateStyle: 'full',
                timeStyle: 'medium'
            });

        const log = new GooCardLog();
        log.title = `${item.item.name} booking pass verified successfully.`
        log.body = getCurrentTime;

        await user.goocard.related('logs').save(log);

        const res = await GooCardLog.query().where('goocard_id', user.goocard.id);
        assert.isNotEmpty(res);
    })
    test('Ensure logs(credit points, booking records and coupons process) are accessable.', async (assert) => { })

})
