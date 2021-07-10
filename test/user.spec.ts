import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/User';
import test, { group } from 'japa'

test.group('Testing user module', (group) => {
    
    const user = new User();

    group.before(async() => {
        await Database.beginGlobalTransaction()
    })

    group.after(async() => {
        await Database.rollbackGlobalTransaction()
    })

    test('Ensure user can be created', async(assert) => {
        user.email = 'abc@gmail.com'
        user.username = 'abc'
        user.password = 'password'
        user.phone = '012345689'
        user.avatar = 'sss'
        await user.save()

        assert.isTrue(user.$isPersisted)
    })

    test('Ensure user is updated', async(assert) => {
        const oldUser = await User.findBy('username', 'abc');

        await user.merge({
            email: 'abc@gmail.com',
            username: 'abc',
            password: 'abc',
            phone: '0122282222',
            avatar: 'ggs'
        }).save()

        assert.notDeepEqual(user, oldUser)
    })

    test('Ensure user password gets hashed during save', async(assert) => {
        assert.notEqual(user.password, 'abc')
    })
})
