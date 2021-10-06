import Database from '@ioc:Adonis/Lucid/Database';
import test, { group } from 'japa'
import supertest from 'supertest'
import { BASE_URL } from 'Config/const';
import Role, { Roles } from 'App/Models/Role';
import User from 'App/Models/User';
import BookingCategory from 'App/Models/BookingCategory';
import { PengerFactory } from 'Database/factories/penger';
import Penger from 'App/Models/Penger';
import { BookingCategoryFactory } from 'Database/factories/booking-category';
import { SystemFunctionFactory } from 'Database/factories/system-function';
import SystemFunction from 'App/Models/SystemFunction';

test.group('Testing booking_options module', (group) => {

    /* 
    * -----------------------------
    * Uncomment for protected auth routes
    * -----------------------------
    */
    let user: User;
    let token: string;
    let category: BookingCategory;
    let penger: Penger;
    let sysFuncs: SystemFunction[];

    group.before(async () => {
        // save the current state of db before testing
        await Database.beginGlobalTransaction()

        /* 
        * -----------------------------
        * Uncomment for protected auth routes
        * -----------------------------
        */
        const roleId = await Role.findByOrFail('name', Roles.Founder)
        user = await User.updateOrCreate({
            username: 'testfounder'
        }, {
            email: 'testfounder@gmail.com',
            password: 'testfounder',
            roleId: roleId.id,
            phone: '0000000009',
            avatar: 'https://robohash.org/2627e0754741a35d48de82c34a4c6bd1?set=set4&bgset=&size=400x400',
            age: 99
        })

        /* 
        * -----------------------------
        * Uncomment for protected auth routes
        * -----------------------------
        */
        await supertest(BASE_URL).post('/auth/penger/login').send({
            phone: user.phone,
            password: 'testfounder'
        }).expect(200).then(response => {
            token = response.body.data.token.token
        })

        // generate category and function
        penger = await PengerFactory.create()
        await penger.related('pengerUsers').attach([user.id]);

        category = await BookingCategoryFactory.create();
        await penger.related('bookingCategories').save(category)

        await penger.load('pengerUsers')
        await penger.load('bookingCategories')

        sysFuncs = await SystemFunctionFactory.createMany(2)
    })

    group.after(async () => {
        // restore db to the state before testing
        await Database.rollbackGlobalTransaction()
    })

    test('[GET]: Find all booking options given a booking category', async (assert) => {
        const { statusCode } = await supertest(BASE_URL).get(`/penger/booking-options?category_id=${category.id}&penger_id=${penger.id}`).set('Authorization', 'Bearer ' + token).expect(200)
        assert.isTrue(statusCode === 200)
    })

    test.skip('[POST]: Create new booking option', async (assert) => {
        const { statusCode } = await supertest(BASE_URL)
            .post(`/penger/booking-options?penger_id=${penger.id}`)
            .set('Authorization', 'Bearer ' + token)
            .send({
                booking_category_id: category.id,
                system_function_ids: sysFuncs.map(i => i.id),
                is_enable: 1
            })
            .expect(200)
        assert.isTrue(statusCode === 200)
    })

    test.skip('[GET]: Find a booking option', async (assert) => {
        await category.load('bookingOptions');
        const { statusCode } = await supertest(BASE_URL).get(`/penger/booking-options/${category.bookingOptions[0].id}`).set('Authorization', 'Bearer ' + token).expect(200)
        assert.isTrue(statusCode === 200)
    })

    test('[UPDATE]: Update booking option', async (assert) => {

        await category.load('bookingOptions');
        const option = category.bookingOptions;
        let newOpt;

        const { statusCode } = await supertest(BASE_URL)
            .put(`/penger/booking-options/${category.id}?penger_id=${penger.id}`)
            .set('Authorization', 'Bearer ' + token)
            .send({
                // data
                // booking_category_id: category.id,
                // system_function_id: newSysFunc.id,
                system_function_ids: [sysFuncs[0].id],
                // is_enable: 0
            })
            .expect(200)
            .then((response) => {
                newOpt = response.body.data.booking_options

                return response
            })

        console.log(option, newOpt)
        assert.isTrue(statusCode === 200)
        assert.notDeepEqual(option, newOpt)
    })

    test.skip('[DELETE]: Delete booking option', async (assert) => {
        await category.load('bookingOptions');
        const option = category.bookingOptions[0]
        const { statusCode } = await supertest(BASE_URL).del(`/penger/booking-options/${option.id}?penger_id=${penger.id}`).set('Authorization', 'Bearer ' + token).expect(200)
        assert.isTrue(statusCode === 200)
    })
})
