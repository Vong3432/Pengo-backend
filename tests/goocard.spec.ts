import Database from '@ioc:Adonis/Lucid/Database';
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

})
