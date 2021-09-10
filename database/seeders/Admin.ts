import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role, { Roles } from 'App/Models/Role'
import User from 'App/Models/User'

export default class AdminSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method

    const roleId = await Role.findByOrFail('name', Roles.Admin)

    await User.updateOrCreate({
      username: 'demoadmin'
    }, {
      email: 'demoadmin@gmail.com',
      password: 'demoadmin',
      roleId: roleId.id,
      phone: '0000000000',
      avatar: 'https://robohash.org/2627e0754741a35d48de82c34a4c6bd1?set=set4&bgset=&size=400x400'
    })
  }
}
