import Database from '@ioc:Adonis/Lucid/Database';
import BookingCloseDate, { CloseDateType } from 'App/Models/BookingCloseDate';
import Penger from 'App/Models/Penger';
import { PengerFactory } from 'Database/factories/penger';
import test from 'japa'
import { DateTime } from 'luxon';

test.group('Testing booking close date module', (group) => {

    let penger: Penger

    group.before(async () => {
        await Database.beginGlobalTransaction()
        penger = await PengerFactory.with('pengerUsers', 1, (user) => user.apply('penger')).create();
    })

    group.after(async () => {
        await Database.rollbackGlobalTransaction()
    })

    test('Ensure booking close date can be created (Organization)', async (assert) => {
        const holiday = new BookingCloseDate()
        holiday.fill({
            pengerId: penger.id,
            type: CloseDateType.Organization,
            keyId: penger.id,
            name: 'Holiday',
            from: DateTime.fromSQL("2027-01-01"),
            to: DateTime.fromSQL("2027-01-01"),
        })
        await penger.related('closeDates').save(holiday)
        await penger.load('closeDates')
        assert.isTrue(penger.closeDates.length > 0)
    })

    test('Ensure booking close date can be removed (Organization)', async (assert) => {
        await penger.load('closeDates')

        // faked data like request.data()
        const removeId = penger.closeDates[0].id
        const afterRemoveCount = penger.closeDates.length - 1
        await penger.related('closeDates').query().where('id', removeId).delete()

        //refresh
        await penger.load('closeDates')

        assert.isTrue(penger.closeDates.length === afterRemoveCount)
    })

    test.skip('Ensure multiple booking close date can be removed (Organization)', async (assert) => {
        await penger.load('closeDates')

        // faked data like request.data()
        const removeIds = penger.closeDates.map(d => d.id)
        const matched = await penger.related('closeDates').query().whereIn('id', removeIds)
        const afterRemoveCount = matched.length - removeIds.length

        // delete date that matched removeIds
        for await (const match of matched) {
            await match.delete();
        }

        //refresh
        await penger.load('closeDates')

        assert.isTrue(penger.closeDates.length === afterRemoveCount)
    })

})
