import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Penger from 'App/Models/Penger'
import PengerLocation from 'App/Models/PengerLocation'
import Role, { Roles } from 'App/Models/Role'
import User from 'App/Models/User'
import GeoService from 'App/Services/GeoService'
import AvatarGenerateService from 'App/Services/helpers/AvatarGenerateService'

export default class FounderSeeder extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method

        const roleId = await Role.findByOrFail('name', Roles.Founder)

        const founder = await User.updateOrCreate({
            username: 'demofounder'
        }, {
            email: 'founder@demo.com',
            password: '12345678',
            roleId: roleId.id,
            phone: '+60149250542',
            avatar: AvatarGenerateService.getAvatar('founder1', {avatar: "micah", gender: "male"})!,
            age: 99
        })

        // create penger
        const penger = await Penger.updateOrCreate({
            name: "Apple"
        }, {
            name: "Apple",
            description: "Not the real Apple",
            logo: AvatarGenerateService.getAvatar('Apple', {avatar: "identicon"})! 
        })

        await penger.load('pengerUsers')

        if(penger.pengerUsers.length > 0) return;

        // link founder to penger.
        await penger.related('pengerUsers').attach([founder.id]);
        await penger.load('location');

        if(penger.location === null) {
            const geolocation = {
                latitude: 1.436820,
                longitude: 103.602060
            }
    
            const address = await GeoService.coordinateToShortAddress(geolocation.latitude, geolocation.longitude)
            const street = await GeoService.coordinateToStreet(geolocation.latitude, geolocation.longitude)

            // link location
            await penger.related('location').updateOrCreate({
                pengerId: penger.id.toString()
            }, {
                name: "Headquarter",
                address: address,
                street,
                geolocation: JSON.stringify(geolocation)
            });
        }
    }
}
