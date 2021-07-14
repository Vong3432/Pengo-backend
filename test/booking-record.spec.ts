import Database from '@ioc:Adonis/Lucid/Database';
import BookingRecord from 'App/Models/BookingRecord';
import { BookingCategoryFactory } from 'Database/factories/booking-category';
import { BookingRecordFactory } from 'Database/factories/booking-record';
import { UserFactory } from 'Database/factories/user';
import test from 'japa'

test.group('Testing booking records module', (group) => {

    group.before(async() => {
        await Database.beginGlobalTransaction()
    })

    group.after(async() => {
        await Database.rollbackGlobalTransaction()
    })

    test('Ensure new record is inserted.', async(assert) => {
        const user = await UserFactory.with('goocard').create();
        const category = await BookingCategoryFactory.with('bookingItems').create();

        const record = await BookingRecordFactory.merge({
            gooCardId: user.goocard.id,
            bookingItemId: category.bookingItems[0].id
        }).create();
        assert.isTrue(record.$isPersisted)
    })

    test('Ensure view record contain item', async(assert) => {
        const record = await BookingRecord.firstOrFail();
        assert.isNotNull(record.item)
    })
    
})
