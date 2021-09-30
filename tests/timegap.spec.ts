import Database from '@ioc:Adonis/Lucid/Database';
import TimeGapService from 'App/Services/core/TimeGapService';
import test, { group } from 'japa'

test.group('Testing timegap module', (group) => {

    group.before(async() => {
        // save the current state of db before testing
        // await Database.beginGlobalTransaction()
    })

    group.after(async() => {
        // restore db to the state before testing
        // await Database.rollbackGlobalTransaction()
    })

    test('Ensure can get time units', async(assert) => {
        const units = TimeGapService.getTimeUnits()
        assert.isNotEmpty(units)
        assert.isArray(units)
    })
})
