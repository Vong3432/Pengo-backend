// import Database from '@ioc:Adonis/Lucid/Database';
import AvatarGenerateService from 'App/Services/helpers/AvatarGenerateService';
import test from 'japa'

test.group('Testing avatar_generate module', (group) => {

    group.before(async() => {
        // save the current state of db before testing
        // await Database.beginGlobalTransaction()
    })

    group.after(async() => {
        // restore db to the state before testing
        // await Database.rollbackGlobalTransaction()
    })

    test('Ensure micah avatar can generate successfully', async(assert) => {
        const url = AvatarGenerateService.getAvatar("ad", {avatar: "micah", gender: "male"})
        assert.isNotNull(url)
    })

    test('Ensure identicon avatar can generate successfully', async(assert) => {
        const url = AvatarGenerateService.getAvatar("ad", {avatar: "identicon"})
        assert.isNotNull(url)
    })
})
