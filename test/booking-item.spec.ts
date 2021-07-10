import Bouncer from '@ioc:Adonis/Addons/Bouncer';
import Database from '@ioc:Adonis/Lucid/Database';
import BookingCategory from 'App/Models/BookingCategory';
import BookingItem from 'App/Models/BookingItem';
import Penger from 'App/Models/Penger';
import Role from 'App/Models/Role';
import User from 'App/Models/User';
import test, { group } from 'japa'

test.group('Testing booking module', (group) => {
    
    const user = new User();
    const penger = new Penger();
    const newCategory = new BookingCategory();

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

    test('Ensure create booking category is created', async(assert) => {
        await newCategory.fill({
            name: "Events"
        }).save();

        assert.isTrue(newCategory.$isPersisted)
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

    test('Create booking item', async(assert) => {
      // find category and current penger.
      const bookingCategory = await BookingCategory.findByOrFail('id', newCategory.id);

      // fake payload
      const payload = {
		posterUrl: 'abc',
		name: "Event 1",
		description: "True event",
		maximum_book: 10,
		maximum_transfer: 10,
		preserved_book: 10,
		credit_points: 100,
		is_preservable: 1,
		is_active: 1,
		is_transferable: 1,
		is_countable: 1,
		is_discountable: 1,
		quantity: 20,
		price: 10,
		discount_amount: 5,
		available_from_time: "10:00",
		available_to_time: "23:59",
		start_from: "2021-01-01 00:00:00",
		end_at: "2021-01-02 23:59:59",
      }

      // create a new booking item
      const bookingItem = new BookingItem();
      bookingItem.fill({
        ...payload
      }).save()
      
      // save booking item into category
      await bookingCategory.related('bookingItems').save(bookingItem);

      assert.isTrue(bookingCategory.$isPersisted);
    })
})
