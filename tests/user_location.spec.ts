import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/User';
import { UserFactory } from 'Database/factories/user';
import test, { group } from 'japa'

test.group('Testing user_location module', (group) => {

    let user: User;

    // for query
    const DEFAULT_LOCATION_NAME = 'TEST_HOME'
    const NEW_LOCATION_NAME = 'TEST_HOME1'

    group.before(async () => {
        // save the current state of db before testing
        await Database.beginGlobalTransaction()
    })

    group.after(async () => {
        // restore db to the state before testing
        await Database.rollbackGlobalTransaction()
    })

    test('Create user and save a location', async (assert) => {
        user = await UserFactory.create();
        const geoObj = JSON.stringify({
            latitude: 123,
            longitude: 123,
        })

        await user.related('locations').updateOrCreate(
            {
                geolocation: geoObj,
            }, {
            name: DEFAULT_LOCATION_NAME,
            geolocation: geoObj,
            isFav: 1, // set as default fav address
        }
        )

        await user.load('locations')
        assert.isTrue(user.locations.length > 0)
    })

    test('Save a new location and set as default', async (assert) => {
        const geoObj = JSON.stringify({
            latitude: 444,
            longitude: 444,
        })

        // save another locations
        const savedLocation = await user.related('locations').updateOrCreate({
            geolocation: geoObj,
        }, {
            name: NEW_LOCATION_NAME,
            geolocation: geoObj,
            isFav: 1,
        })

        await user.load('locations')

        for (const location of user.locations) {
            if (location.id !== savedLocation.id) {
                location.merge({ isFav: 0 })
                await location.save()
            }
        }


        assert.isTrue(true)
    })

    test(`Ensure only ${NEW_LOCATION_NAME}'s isFav is 1 only'`, async (assert) => {
        let count = 0;
        await user.load('locations')

        user.locations.forEach(l => {
            if (l.isFav === 1)
                count++; // increment if find a location's isFav is 1
        });

        assert.equal(count, 1)
    })

    test(`Ensure location info can be updated`, async (assert) => {
        await user.load('locations')

        const uL = await user.related('locations').query().firstOrFail()
        const oldUL = { ...uL }

        await uL.merge({
            name: "UPDATED",
            geolocation: JSON.stringify({
                latitude: 8787,
                longitude: 8787,
            })
        }).save()

        assert.notDeepEqual(uL, oldUL)
    })
})
