import Database from '@ioc:Adonis/Lucid/Database';
import test from 'japa'

test.group('Testing booking records module', (group) => {

    group.before(async() => {
        await Database.beginGlobalTransaction()
    })

    group.after(async() => {
        await Database.rollbackGlobalTransaction()
    })

    test('Ensure new record is inserted.', async(assert) => {})
    test('Ensure view record is returned correct data with id.', async(assert) => {})
    
})
