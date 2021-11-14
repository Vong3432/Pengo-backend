import Database from '@ioc:Adonis/Lucid/Database';
import BookingItem from 'App/Models/BookingItem';
import BookingRecord from 'App/Models/BookingRecord';
import Feedback from 'App/Models/Feedback';
import { BookingCategoryFactory } from 'Database/factories/booking-category';
import { BookingItemFactory } from 'Database/factories/booking-item';
import { BookingRecordFactory } from 'Database/factories/booking-record';
import { PengerFactory } from 'Database/factories/penger';
import { UserFactory } from 'Database/factories/user';
import test from 'japa'

test.group('Testing feedback module', (group) => {

    const FEEDBACK_TITLE = 'FEEDBACK1'
    const FEEDBACK_DESCRIPTION = 'Very nice'

    group.before(async () => {
        // save the current state of db before testing
        await Database.beginGlobalTransaction()
    })

    group.after(async () => {
        // restore db to the state before testing
        await Database.rollbackGlobalTransaction()
    })

    let item: BookingItem | null = null;

    test('Ensure user can add feedback', async (assert) => {
        try {
            const user = await UserFactory.with('goocard').create()
            const penger = await PengerFactory.create()

            const category = await BookingCategoryFactory.with('bookingItems').create();
            await category.load('bookingItems')
            item = category.bookingItems[0];

            await user.load('goocard')

            const record = await BookingRecordFactory.merge({
                gooCardId: user.goocard.id,
                bookingItemId: item.id,
                pengerId: penger.id,
                rewardPoint: 100,
            }).create()

            const feedback = new Feedback()

            await feedback.merge({
                bookingRecordId: record.id,
                title: FEEDBACK_TITLE,
                description: FEEDBACK_DESCRIPTION,
                category: 'record'
            }).save()

            assert.isTrue(feedback.$isPersisted)
        } catch (error) {
            console.log(error)
            assert.fail()
        }
    })

    test('Get feedback of a item', async (assert) => {
        try {
            if (item === null) return assert.fail()

            const recordsOfThisItem = await BookingRecord.query().where('booking_item_id', item.id)
            const recordIds = recordsOfThisItem.map(r => r.id)

            const feedbacks = await Feedback.query().whereIn('record_id', recordIds)

            assert.isTrue(feedbacks.length > 0)

        } catch (error) {
            console.log(error)
            assert.fail()
        }
    })
})
