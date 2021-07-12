import Bouncer from '@ioc:Adonis/Addons/Bouncer';
import Database from '@ioc:Adonis/Lucid/Database';
import Penger from 'App/Models/Penger';
import Role from 'App/Models/Role';
import User from 'App/Models/User';
import { BookingCategoryFactory } from 'Database/factories/booking-category';
import { BookingItemFactory } from 'Database/factories/booking-item';
import test, { group } from 'japa'

test.group('Testing booking module', (group) => {
    
    const user = new User();
    const penger = new Penger();

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

        // assign as Pengoo
        const pengooRole = await Role.findByOrFail('id', 1);
        await pengooRole.related('users').save(user)

        assert.isTrue(user.$isPersisted)
    })

    /*
    * -----------------------------------------------
    * Penger only
    * -----------------------------------------------
    */
    test.failing('Ensure Pengoo cannot create item', async(assert) => {
        const isPengoo = user.roleID === 1       
        assert.isFalse(isPengoo, 'Expected Penger is authorized only ')
    })

    test('Ensure Penger only', async (assert) => {
        // assign as Staff
        user.roleID = 2;
        user.save();
        
        const isNotPengoo = user.roleID !== 1

        assert.isTrue(isNotPengoo)
    })

    test('Ensure Penger created', async(assert) => {
        await penger.fill({
            name: "PengerA",
            logo: "abc"
        }).save()

        await user.related('pengers').save(penger);

        assert.isTrue(penger.$isPersisted)
    })

    test('Penger id is matched', async(assert) => {
        const res = user.related('pengers').query().wherePivot('penger_id', penger.id) ? true : false
        assert.isTrue(res)
      })

    test('Create booking item with category', async(assert) => {
      
      // save booking item into category
      const category = await BookingCategoryFactory.with('bookingItems').create();

      assert.isAbove(category.bookingItems.length, 0);
    })

    test('Update booking item', async(assert) => {})
    test('Delete/Deactive booking item', async(assert) => {})
})
