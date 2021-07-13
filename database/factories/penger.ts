import Factory from '@ioc:Adonis/Lucid/Factory'
import Penger from 'App/Models/Penger';
import { UserFactory } from './user';

export const PengerFactory = Factory
  .define(Penger, ({ faker }) => {
    return {
      name: faker.internet.userName(),
      logo: faker.internet.avatar()
    }
  })
  .relation('pengerUsers', () => UserFactory)
  .build()
