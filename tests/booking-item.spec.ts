import Database from '@ioc:Adonis/Lucid/Database';
import BookingItem from 'App/Models/BookingItem';
import Penger from 'App/Models/Penger';
import { Roles } from 'App/Models/Role';
import User from 'App/Models/User';
import { TimeGapUnit } from 'Config/const';
import { BookingCategoryFactory } from 'Database/factories/booking-category';
import { BookingItemFactory } from 'Database/factories/booking-item';
import { PengerFactory } from 'Database/factories/penger';
import { UserFactory } from 'Database/factories/user';
import test from 'japa'

test.group('Testing booking module', (group) => {

    group.before(async() => {
        await Database.beginGlobalTransaction()
    })

    group.after(async() => {
        await Database.rollbackGlobalTransaction()
    })

    test('Ensure user can be created', async(assert) => {
        const user = await UserFactory.apply('user').create();
        assert.isTrue(user.$isPersisted)
    })

    /*
    * -----------------------------------------------
    * Penger only
    * -----------------------------------------------
    */
    test.failing('Ensure Pengoo cannot create item', async(assert) => {
        const isPengoo = await User.first();     
        assert.isFalse(isPengoo, 'Expected Penger is authorized only ')
    })

    test('Ensure Penger only', async (assert) => {
        const penger = await PengerFactory.with('pengerUsers', 1, (user) => user.apply('penger')).create();
        const user = await penger.related('pengerUsers').query().preload('role').firstOrFail();
        const isNotPengoo = user.role.name !== Roles.Pengoo;

        assert.isTrue(isNotPengoo)
    })

    test('Ensure User and Penger is linked', async(assert) => {
        const penger = await Penger.firstOrFail();
        const user = await penger.related('pengerUsers').query().firstOrFail();
        assert.isTrue(user.$extras.pivot_penger_id == penger.id);
    })

    test('Create booking item with category', async(assert) => {
      
      // save booking item into category
      const category = await BookingCategoryFactory.with('bookingItems').create();

      assert.isAbove(category.bookingItems.length, 0);
    })

    test('Update booking item', async(assert) => {
        const item = await BookingItem.findByOrFail('name', 'Event 1');
        const newName = "New Event";
        
        await item.merge({
            name: newName
        }).save();

        assert.isTrue(item.name == newName);
    })

    test('Ensure gap units of booking item can be set', async(assert) => {
        const item = await BookingItemFactory.apply('hrsGapUnits').create()
        assert.isTrue(item.timeGapUnits === TimeGapUnit.HOURS);
    })
    
    test('Delete/Deactive booking item', async(assert) => {
        const item = await BookingItem.findByOrFail('name', 'New Event');
        await item.merge({
            isActive: 0
        }).save();

        assert.isTrue(item.isActive == 0);
    })
})
