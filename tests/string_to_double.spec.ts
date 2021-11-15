import Database from '@ioc:Adonis/Lucid/Database';
import test, { group } from 'japa'

test.group('Testing string_to_double module', (group) => {

    group.before(async () => {
        // save the current state of db before testing
        await Database.beginGlobalTransaction()
    })

    group.after(async () => {
        // restore db to the state before testing
        await Database.rollbackGlobalTransaction()
    })

    test('Ensure string to double can work', async (assert) => {
        const stringVal = "5"

        const toDoubleVal = parseFloat(stringVal)
        const expected: number = 5
        assert.deepStrictEqual(toDoubleVal, expected)
    })

    test('Ensure string to double, then divide 100% can work', async (assert) => {
        const stringVal = "5"
        const toDoubleVal = parseFloat(stringVal) / 100
        const expected = 0.05
        assert.deepStrictEqual(toDoubleVal, expected)
    })
})
