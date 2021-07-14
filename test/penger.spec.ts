import Database from '@ioc:Adonis/Lucid/Database';
import Penger from 'App/Models/Penger';
import Role, { Roles } from 'App/Models/Role';
import User from 'App/Models/User';
import { LocationFactory } from 'Database/factories/location';
import { PengerFactory } from 'Database/factories/penger';
import { UserFactory } from 'Database/factories/user';
import test, { group } from 'japa'

test.group('Testing Penger module', (group) => {

    group.before(async() => {
        await Database.beginGlobalTransaction()
    })

    group.after(async() => {
        await Database.rollbackGlobalTransaction()
    })

    test('Ensure founder can be created', async(assert) => {
        const user = await UserFactory.apply('founder').create();
        assert.isTrue(user.$isPersisted)
    })
    test('Ensure founder can create Penger', async(assert) => {
        const user = await User.firstOrFail();
        const penger = await PengerFactory.create();

        await penger.related('pengerUsers').attach([user.id]);
        const ans = await penger.related('pengerUsers').query().preload('role').firstOrFail();

        assert.isTrue(ans.role.name === Roles.Founder && ans.id == user.id)
    })
    test('Ensure founder can add penger staff to Penger', async(assert) => {
        const penger = await Penger.firstOrFail();
        const staff = await UserFactory.apply('penger').create();

        await penger.related('pengerUsers').attach([staff.id]);
        const l = (await penger.related('pengerUsers').query()).length;
        assert.equal(l, 2);
    })

    test('Ensure Penger can new add location', async(assert) => {
        const penger = await Penger.firstOrFail();
        const location = await LocationFactory.create();

        await penger.related('locations').attach({
            [location.id]: {
                name: 'New Penger'
            }
        });
        const l = (await penger.related('locations').query()).length

        assert.isAbove(l, 0)
    })

})
