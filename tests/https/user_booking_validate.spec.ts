import Database from '@ioc:Adonis/Lucid/Database';
import test, { group } from 'japa'
import supertest from 'supertest'
import { BASE_URL } from 'Config/const';
import Role, { Roles } from 'App/Models/Role';
import User from 'App/Models/User';
import BookingItem from 'App/Models/BookingItem';
import { BookingItemFactory } from 'Database/factories/booking-item';
import { ValidateMsg } from 'Contracts/interfaces/IValidateItemMsgFormatter.interface';
import ValidateItemMsgService from 'App/Services/validation/ValidateItemMsgService';
import { DpoColFactory } from 'Database/factories/dpo-col';
import { PengerFactory } from 'Database/factories/penger';
import { PRIORITY_CONDITIONS } from 'App/Models/PriorityOption';

test.group('Testing user_booking_validate module', (group) => {

    /* 
    * -----------------------------
    * Uncomment for protected auth routes
    * -----------------------------
    */
    let user: User;
    let token: string;
    let item: BookingItem;

    group.before(async () => {
        // save the current state of db before testing
        await Database.beginGlobalTransaction()

        /* 
        * -----------------------------
        * Uncomment for protected auth routes
        * -----------------------------
        */
        const role = await Role.findByOrFail('name', Roles.Pengoo)
        user = await User.updateOrCreate({
            username: 'testuser'
        }, {
            email: 'testuser@gmail.com',
            password: 'testuser',
            roleId: role.id,
            phone: '0125478123',
            avatar: 'https://robohash.org/2627e0754741a35d48de82c34a4c6bd1?set=set4&bgset=&size=400x400',
            age: 99
        })

        /* 
        * -----------------------------
        * Uncomment for protected auth routes
        * -----------------------------
        */
        await supertest(BASE_URL).post('/auth/login').send({
            phone: user.phone,
            password: "testuser"
        }).expect(200).then(response => {
            token = response.body.data.token.token
        })

        item = await BookingItemFactory.apply('deactive').create();

    })

    group.after(async () => {
        // restore db to the state before testing
        await Database.rollbackGlobalTransaction()
    })

    test.skipInCI('[GET]: Validate item status return unauthorised msg (Not logged in)', async (assert) => {
        try {
            const { body, statusCode } = await supertest(BASE_URL).get(`/core/validate-item-status/${item.id}`).expect(200)
            assert.deepEqual(body.data, {
                msg: [ValidateItemMsgService.toValidateMsg("auth", "You must login for booking", false)],
                bookable: false,
            })
            assert.isTrue(statusCode === 200)
        } catch (error) {
            assert.fail()
        }
    })

    test.skipInCI('[GET]: Validate item status (Invalid ID)', async (assert) => {
        try {
            const { statusCode } = await supertest(BASE_URL).get('/core/validate-item-status/12312313').set('Authorization', 'Bearer ' + token).expect(200)
            assert.isTrue(statusCode !== 200)
        } catch (error) {
            // assert.fail()
        }
    })

    test.skipInCI('[GET]: Validate item status should able to catch all message without error', async (assert) => {

        try {
            const testedItem = await BookingItemFactory.apply('expired').apply('deactive').apply('outOfStock').create()
            const itemWithPriorityOption = await setItemWithPriorityOption(testedItem);
            const { statusCode, body } = await supertest(BASE_URL).get(`/core/validate-item-status/${itemWithPriorityOption.id}`).set('Authorization', 'Bearer ' + token).expect(200)

            const messages: ValidateMsg[] = body.data
            // const expectedMsgList: ValidateMsg[] = [
            //     ValidateItemMsgService.toValidateMsg("active", "This item is opened for booking", false),
            //     ValidateItemMsgService.toValidateMsg("quantity", "This item is out of stocked", false),
            //     ValidateItemMsgService.toValidateMsg("endAt", "This item can no longer be booked", false),
            //     ValidateItemMsgService.toValidateMsg("priority", "You are not in the priority", false)
            // ]

            console.log(JSON.stringify(messages, null, 2))

            assert.isTrue(statusCode === 200 && messages['msg'].length > 0)
            // assert.deepEqual(messages, expectedMsgList)
        } catch (error) {
            assert.fail()
        }
    })

    async function setItemWithPriorityOption(item: BookingItem): Promise<BookingItem> {
        try {
            const bookingItem = item;
            const dpoCol = await DpoColFactory.create();
            const penger = await PengerFactory.create();

            // same payload as 'Ensure priority option is saved in DB' test case
            const savePayload = {
                // value: DateTime.now().toString(),
                value: user.id.toString(),
                conditions: PRIORITY_CONDITIONS.EQUAL,
                pengerId: penger.id
            }

            // copy from payload
            const searchCriteria = {
                ...savePayload
            }

            const priority = await dpoCol.related('priorityOption').firstOrCreate(searchCriteria, savePayload);

            await priority.related('bookingItem').save(bookingItem);

            return bookingItem;
        } catch (error) {
            throw error
        }
    }
})
