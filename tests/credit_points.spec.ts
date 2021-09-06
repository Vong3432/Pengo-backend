import Database from '@ioc:Adonis/Lucid/Database';
import CreditPoint from 'App/Models/CreditPoint';
import User from 'App/Models/User';
import { BookingItemFactory } from 'Database/factories/booking-item';
import { PengerFactory } from 'Database/factories/penger';
import { UserFactory } from 'Database/factories/user';
import test, { group } from 'japa'

test.group('Testing credit_points module', (group) => {

    group.before(async () => {
        // save the current state of db before testing
        await Database.beginGlobalTransaction()
    })

    group.after(async () => {
        // restore db to the state before testing
        await Database.rollbackGlobalTransaction()
    })

    let user;
    let item;
    let penger;

    test('Add credit points to new goocard', async (assert) => {
        user = await UserFactory.with('goocard', 1).create();
        item = await BookingItemFactory.apply('credit_points').create();
        penger = await PengerFactory.create();

        const credit = await CreditPoint.firstOrCreate({
            gooCardId: user.goocard.id,
            pengerId: penger.id,
        }, {
            totalCreditPoints: 0,
            availableCreditPoints: 0
        });

        credit.merge({
            totalCreditPoints: item.creditPoints,
            availableCreditPoints: item.creditPoints,
        });

        await user.goocard.related('creditPoints').save(credit);
        await user.goocard.load('creditPoints');

        assert.equal(user.goocard.creditPoints.totalCreditPoints, 200)
    })

    test('Update credit points to goocard', async (assert) => {
        const credit = await CreditPoint.firstOrCreate({
            gooCardId: user.goocard.id,
            pengerId: penger.id,
        }, {
            totalCreditPoints: 0,
            availableCreditPoints: 0
        });

        await credit.merge({
            totalCreditPoints: credit.totalCreditPoints + item.creditPoints,
            availableCreditPoints: credit.availableCreditPoints + item.creditPoints,
        }).save();

        await user.goocard.load('creditPoints');
        assert.equal(user.goocard.creditPoints.totalCreditPoints, 400)
    })

})
