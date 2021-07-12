import Database from '@ioc:Adonis/Lucid/Database';
import test from 'japa'

test.group('Testing booking records module', (group) => {

    group.before(async() => {
        await Database.beginGlobalTransaction()
    })

    group.after(async() => {
        await Database.rollbackGlobalTransaction()
    })

    test('Ensure goocard is linked with new user.', async(assert) => {})
    test('Ensure new pin is saved.', async(assert) => {})
    test('Ensure credit point access is verified through goocard.', async(assert) => {})
    test('Ensure booking records access is verified through goocard.', async(assert) => {})
    test('Ensure coupon access is verified through goocard.', async(assert) => {})
    test('Ensure logs(credit points, booking records and coupons process) are accessable.', async(assert) => {})
    
})
