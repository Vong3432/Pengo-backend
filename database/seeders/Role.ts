import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class RoleSeeder extends BaseSeeder {
  public async run () {
    const uniqueKey = 'name'
    // Write your database queries inside the run method
    await Role.updateOrCreateMany(uniqueKey, [
      {
        name: 'pengoo',
        isActive: 1
      },
      {
        name: 'penger',
        isActive: 1
      },
      {
        name: 'penger_staff',
        isActive: 1
      },
      {
        name: 'admin',
        isActive: 1
      }
    ])
  }
}
