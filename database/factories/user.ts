import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import Role, { Roles } from 'App/Models/Role';
import { LocationFactory } from './location';
import { GooCardFactory } from './goocard';

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.phoneNumber(),
      avatar: faker.internet.avatar()
    }
  })
  .relation('locations', () => LocationFactory)
  .relation('goocard', () => GooCardFactory)
  .state('user', async (item) => {
    const role = await Role.findBy('name', Roles.Pengoo)
    item.roleId = role!.id; 
  })
  .state('penger', async (item) => {
    const role = await Role.findBy('name', Roles.Staff)
    item.roleId = role!.id; 
  })
  .build()
