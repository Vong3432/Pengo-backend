import DateCheckHelperService from 'App/Services/helpers/DateCheckHelperService';
import test from 'japa'
import { DateTime } from 'luxon';

test.group('Testing date_check_helper module', (group) => {

    group.before(async() => {
        // save the current state of db before testing
        // await Database.beginGlobalTransaction()
    })

    group.after(async() => {
        // restore db to the state before testing
        // await Database.rollbackGlobalTransaction()
    })

    test('Should return true when current is over than target (ISO format)', async(assert) => {
        const currentIso: string = DateTime.now().toISO()
        const targetIso: string = DateTime.fromFormat('2021-01-01 00:00:00', "yyyy-MM-dd HH:mm:ss").toISO()
        const isCurrentNewerThanTargetIso = DateCheckHelperService.isCurrentOverTargetISO({targetIso, currentIso})
        assert.isTrue(isCurrentNewerThanTargetIso)
    })

    test('Should return false when target is over than current (ISO format)', async(assert) => {
        const currentIso: string = DateTime.now().toISO()
        const targetIso: string = DateTime.fromFormat('2022-01-01 00:00:00', "yyyy-MM-dd HH:mm:ss").toISO()
        const isCurrentNewerThanTargetIso = DateCheckHelperService.isCurrentOverTargetISO({targetIso, currentIso})
        assert.isFalse(isCurrentNewerThanTargetIso)
    })
})
