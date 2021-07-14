import Factory from '@ioc:Adonis/Lucid/Factory'
import Location from 'App/Models/Location';

export const LocationFactory = Factory
  .define(Location, ({ faker }) => {
      const s = JSON.stringify({
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude()
    })

    return {
        name: faker.lorem.words(5),
        address1: faker.address.streetAddress(),
        address2: faker.address.secondaryAddress(),
        geolocation: s
    }
  })
  .build()
