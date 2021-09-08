import DateConvertHelperService from 'App/Services/helpers/DateConvertHelperService';
import test, { group } from 'japa'

test.group('Testing date_convert_helper module', (group) => {

    group.before(async () => {
        // save the current state of db before testing
        // await Database.beginGlobalTransaction()
    })

    group.after(async () => {
        // restore db to the state before testing
        // await Database.rollbackGlobalTransaction()
    })

    test('Ensure Date is formatted to readable text', async (assert) => {
        const s = await DateConvertHelperService.fromDateToReadableText(Date.now(), { dateStyle: 'full', timeStyle: 'short' });
        assert.isTrue(s.length > 0)
    })

    test('Ensure date to text can catch error and return message', async (assert) => {
        try {
            // This should throw error
            await DateConvertHelperService.fromDateToReadableText(parseInt('ad'), { dateStyle: 'full', timeStyle: 'short' });
        } catch (error) {
            assert.equal(error, 'Please ensure date format is correct.')
        }
    })
})
