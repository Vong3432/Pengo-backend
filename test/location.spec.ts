import Database from '@ioc:Adonis/Lucid/Database';
import test from 'japa'

test.group('Testing location module', (group) => {

    group.before(async() => {
        await Database.beginGlobalTransaction()
    })

    group.after(async() => {
        await Database.rollbackGlobalTransaction()
    })

    test('Ensure Pengoo can save location.', async(assert) => {})
    test('Ensure lng and longitude can be accessed.', async(assert) => {})
    
})
