import Database from '@ioc:Adonis/Lucid/Database';
import GeoService from 'App/Services/GeoService';
import test, { group } from 'japa'

test.group('Testing geoservice module', (group) => {

    group.before(async() => {
        // save the current state of db before testing
        // await Database.beginGlobalTransaction()
    })

    group.after(async() => {
        // restore db to the state before testing
        // await Database.rollbackGlobalTransaction()
    })

    const geolocation = {
        latitude: 1.436820,
        longitude: 103.602060
    }

    test('Ensure coordinateToStreet can work', async(assert) => {
        const street = await GeoService.coordinateToStreet(geolocation.latitude, geolocation.longitude)
        assert.isNotNull(street)
    })

    test('Ensure coordinateToShortAddress can work', async(assert) => {
        const address = await GeoService.coordinateToShortAddress(geolocation.latitude, geolocation.longitude)
        assert.isNotNull(address)
    })
})
