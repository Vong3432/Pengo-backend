import Database from '@ioc:Adonis/Lucid/Database';
import { string } from '@ioc:Adonis/Core/Helpers'
import BookingItem from 'App/Models/BookingItem';
import DpoCol from 'App/Models/DpoCol';
import Penger from 'App/Models/Penger';
import PriorityOption, { PRIORITY_CONDITIONS } from 'App/Models/PriorityOption';
import User from 'App/Models/User';
import CheckPriorityConditionService from 'App/Services/priority/CheckPriorityConditionService';
import { BookingItemFactory } from 'Database/factories/booking-item';
import { DpoColFactory } from 'Database/factories/dpo-col';
import test from 'japa'

/*
    This test requires `dpo_cols` and `dpo_tables` in db which can be only set
    in the admin dashboard.
*/
test.group('Testing priority_option module', (group) => {

    // track new priority option that added in testing.
    let id;
    let bid;

    group.before(async () => {
        // save the current state of db before testing
        await Database.beginGlobalTransaction()
    })

    group.after(async () => {
        // restore db to the state before testing
        await Database.rollbackGlobalTransaction()
    })

    test('Ensure priority option is saved in DB', async (assert) => {
        const dpoCol = await DpoCol.firstOrFail();
        const penger = await Penger.firstOrFail(); // grab first penger's id for testing

        const priority = new PriorityOption();
        priority.fill({
            value: "50",
            conditions: PRIORITY_CONDITIONS.EQUAL,
            pengerId: penger.id
        })

        await dpoCol.related('priorityOption').save(priority);
        id = priority.id;
        assert.isTrue(priority.$isPersisted)
    })

    test('Ensure new priority option can be find', async (assert) => {
        const priority = await PriorityOption.findOrFail(id);
        console.log(`Find ${id}: ${JSON.stringify(priority.toJSON())}`)
        assert.isNotEmpty(priority)
    })

    test('Ensure firstOrCreate will not create duplication (same record)', async (assert) => {
        const dpoCol = await DpoCol.firstOrFail();
        const penger = await Penger.firstOrFail();

        // same payload as 'Ensure priority option is saved in DB' test case
        const savePayload = {
            value: "50",
            conditions: PRIORITY_CONDITIONS.EQUAL,
            pengerId: penger.id
        }

        // copy from payload
        const searchCriteria = {
            ...savePayload
        }

        const priority = await dpoCol.related('priorityOption').firstOrCreate(searchCriteria, savePayload);

        // make sure priority is not being saved to DB.
        assert.isFalse(priority.$isLocal)
    })

    test('Ensure firstOrCreate will save new priority (no same record)', async (assert) => {
        const dpoCol = await DpoCol.firstOrFail();
        const penger = await Penger.firstOrFail();

        // same payload as 'Ensure priority option is saved in DB' test case
        const savePayload = {
            value: "60",
            conditions: PRIORITY_CONDITIONS.EQUAL,
            pengerId: penger.id
        }

        // copy from payload
        const searchCriteria = {
            ...savePayload
        }

        const priority = await dpoCol.related('priorityOption').firstOrCreate(searchCriteria, savePayload);

        // make sure priority is not being saved to DB.
        assert.isTrue(priority.$isLocal)
    })

    test('Ensure priorityOption can be saved in BookingItem', async (assert) => {
        const bookingItem = await BookingItemFactory.create();
        const dpoCol = await DpoColFactory.create();
        const penger = await Penger.firstOrFail();

        // same payload as 'Ensure priority option is saved in DB' test case
        const savePayload = {
            // value: DateTime.now().toString(),
            value: "4",
            conditions: PRIORITY_CONDITIONS.EQUAL,
            pengerId: penger.id
        }

        // copy from payload
        const searchCriteria = {
            ...savePayload
        }

        const priority = await dpoCol.related('priorityOption').firstOrCreate(searchCriteria, savePayload);

        await priority.related('bookingItem').save(bookingItem);

        await priority.load('bookingItem')

        bid = bookingItem.id;

        // make sure priority is linked with item and saved in DB.
        assert.isTrue(priority.$isPersisted && (priority.bookingItem.id === bookingItem.id))
    })

    test('Ensure user can book', async (assert) => {
        const bookingItem = await BookingItem.findOrFail(bid);
        await bookingItem.load('priorityOption', q => q.preload('dpoCol')); // load priority options, dpo_col
        const dpoCol = bookingItem.priorityOption.dpoCol;

        /*
            We check with user with id `4`, 
            because the previous test `Ensure priorityOption can be saved in BookingItem` we save value `4` in PriorityOption
         */
        const user = await User.firstOrFail();

        // check equality
        // pseudo: user[KEY_TO_CHECK] === [VALUE]
        // below eg: user[4] === 4

        const valFromDB = user[string.camelCase(dpoCol.column)]

        assert.isTrue(
            CheckPriorityConditionService
                .validateCondition(
                    valFromDB.toString(),
                    bookingItem.priorityOption.value,
                    bookingItem.priorityOption.conditions
                )
        )
    })

    test.skip('Ensure user with ID 4 can book', async (assert) => {
        const bookingItem = await BookingItem.findOrFail(bid);
        await bookingItem.load('priorityOption', q => q.preload('dpoCol')); // load priority options, dpo_col
        const dpoCol = bookingItem.priorityOption.dpoCol;

        /*
            We check with user with id `4`, 
            because the previous test `Ensure priorityOption can be saved in BookingItem` we save value `4` in PriorityOption
         */
        const user = await User.findOrFail(4);
        const valFromDB = user[string.camelCase(dpoCol.column)]

        // check equality
        // pseudo: user[KEY_TO_CHECK] === [VALUE]
        // below eg: user[4] === 4
        assert.isTrue(
            CheckPriorityConditionService
                .validateCondition(
                    valFromDB.toString(),
                    bookingItem.priorityOption.value,
                    bookingItem.priorityOption.conditions
                )
        )
    })

    test.failing('Ensure user with ID not 4 cannot book', async (assert) => {
        const bookingItem = await BookingItem.findOrFail(bid);
        await bookingItem.load('priorityOption', q => q.preload('dpoCol')); // load priority options, dpo_col
        const dpoCol = bookingItem.priorityOption.dpoCol;

        /*
            We get users with id that is not `4`, 
            because the previous test `Ensure priorityOption can be saved in BookingItem` we save value `4` in PriorityOption.
            This case is to fail the test so that users id other than `4` cannot book the item.
         */
        const user = await User.query().whereNot('id', 4).firstOrFail();

        const valFromDB = user[string.camelCase(dpoCol.column)]

        // check equality
        // pseudo: user[KEY_TO_CHECK] === [VALUE]
        // below eg: user[14] === 4
        assert.isTrue(
            CheckPriorityConditionService
                .validateCondition(
                    valFromDB.toString(),
                    bookingItem.priorityOption.value,
                    bookingItem.priorityOption.conditions
                )
        )
    })
})
