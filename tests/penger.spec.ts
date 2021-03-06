import Database from '@ioc:Adonis/Lucid/Database';
import Penger from 'App/Models/Penger';
import Role, { Roles } from 'App/Models/Role';
import User from 'App/Models/User';
import { LocationFactory } from 'Database/factories/location';
import { PengerFactory } from 'Database/factories/penger';
import { UserFactory } from 'Database/factories/user';
import test, { group } from 'japa'

test.group('Testing Penger module', (group) => {

    group.before(async () => {
        await Database.beginGlobalTransaction()
    })

    group.after(async () => {
        await Database.rollbackGlobalTransaction()
    })

    let user: User;
    let penger: Penger;

    test('Ensure founder can be created', async (assert) => {
        user = await UserFactory.apply('founder').create();
        assert.isTrue(user.$isPersisted)
    })
    test('Ensure founder can create Penger', async (assert) => {
        penger = await PengerFactory.create();

        await penger.related('pengerUsers').attach([user.id]);
        const ans = await penger.related('pengerUsers').query().preload('role').firstOrFail();

        assert.isTrue(ans.role.name === Roles.Founder && ans.id == user.id)
    })
    test('Ensure founder can add penger staff to Penger', async (assert) => {
        const staff = await UserFactory.apply('penger').create();

        await penger.related('pengerUsers').attach([staff.id]);
        const l = (await penger.related('pengerUsers').query()).length;
        assert.equal(l, 2);
    })

})
