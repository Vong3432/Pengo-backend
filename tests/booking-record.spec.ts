import Database from '@ioc:Adonis/Lucid/Database';
import BookingItem from 'App/Models/BookingItem';
import BookingRecord from 'App/Models/BookingRecord';
import Penger from 'App/Models/Penger';
import { BookingRecordFactory } from 'Database/factories/booking-record';
import { PengerFactory } from 'Database/factories/penger';
import { UserFactory } from 'Database/factories/user';
import test from 'japa'

test.group('Testing booking records module', (group) => {

    group.before(async () => {
        await Database.beginGlobalTransaction()
    })

    group.after(async () => {
        await Database.rollbackGlobalTransaction()
    })

    let penger: Penger;

    test('Ensure new record is inserted.', async (assert) => {
        const user = await UserFactory.with('goocard').create();
        penger = await PengerFactory.with('bookingCategories', 1, (cat) => cat.with('bookingItems')).create();

        const record = await BookingRecordFactory.merge({
            gooCardId: user.goocard.id,
            bookingItemId: penger.bookingCategories[0].bookingItems[0].id
        }).create();
        assert.isTrue(record.$isPersisted)
    })

    test('Ensure view record contain item', async (assert) => {
        const record = await BookingRecord.firstOrFail();
        assert.isNotNull(record.item)
    })

    test('Ensure view records of item', async (assert) => {
        const cateid = (await penger.related('bookingCategories').query().firstOrFail()).id;
        const itemid = (await BookingItem.query().where('booking_category_id', cateid.toString()).firstOrFail()).id;
        const records = await BookingRecord.query().where('booking_item_id', itemid.toString());
        assert.isAbove(records.length, 0)
    })

})
