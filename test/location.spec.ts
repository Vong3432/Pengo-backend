import Database from '@ioc:Adonis/Lucid/Database';
import Location from 'App/Models/Location';
import User from 'App/Models/User';
import { LocationFactory } from 'Database/factories/location';
import { UserFactory } from 'Database/factories/user';
import test from 'japa'

test.group('Testing location module', (group) => {

    group.before(async() => {
        await Database.beginGlobalTransaction()
    })

    group.after(async() => {
        await Database.rollbackGlobalTransaction()
    })

    test('Ensure a location is created.', async(assert) => {
        const location = await LocationFactory.create();
        assert.isTrue(location.$isPersisted);
    })

    test('Ensure Pengoo can save location.', async(assert) => {
        const user = await UserFactory.apply('user').create();
        const location = await Location.firstOrFail();

        await user.related('locations').attach({
            [location.id]: {
                name: 'New Penger'
            }
        });

        const l = (await user.related('locations').query()).length
        assert.isAbove(l, 0)
    })

    test('Ensure lng and lng of user can be accessed.', async(assert) => {
        const user = await User.firstOrFail();
        const location = await user.related('locations').query().firstOrFail();
        const parsed = JSON.parse(location.geolocation)
        const geo = {
            lat: parsed.latitude,
            lng: parsed.longitude
        }
        assert.isTrue(geo.lat !== null && geo.lng !== null)
    })

    test.skip('Ensure geolocator return lng and lat.', async(assert) => {
        
    })
    
})
