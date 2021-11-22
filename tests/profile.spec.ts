import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/User';
import { UserFactory } from 'Database/factories/user';
import test, { group } from 'japa'

test.group('Testing profile module', (group) => {

    let user: User

    group.before(async () => {
        // save the current state of db before testing
        await Database.beginGlobalTransaction()
    })

    group.after(async () => {
        // restore db to the state before testing
        await Database.rollbackGlobalTransaction()
    })

    test('Make new user account', async (assert) => {
        user = await UserFactory.create();
        assert.isTrue(user.$isPersisted)
    })

    test.failing('Make sure duplicate email, phone throw err', async (assert) => {
        const dup = {
            email: user.email,
            phone: user.phone,
        }

        const duplicate = await User.query()
            .where('email', dup.email)
            .orWhere('phone', dup.phone)
            .firstOrFail()

        if (duplicate !== null)
            assert.fail("Duplicated found, please try another email or phone.")
    })

    test('Ensure username, email, password, phone, avatar is updated', async (assert) => {

        const prev: User = { ...user }

        const data = {
            username: 'ad',
            email: 'a',
            password: 'xxxxx',
            phone: '0121212312',
            avatar: 'xxx',
        }

        await user.merge(data).save()

        assert.notDeepEqual(user, prev)
    })

})
