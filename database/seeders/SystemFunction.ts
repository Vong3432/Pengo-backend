import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import SystemFunction from 'App/Models/SystemFunction'

export default class SystemFunctionSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    // Write your database queries inside the run method
    await SystemFunction.updateOrCreateMany(uniqueKey, [
      {
        name: 'Fixed timeslot',
        isActive: 1,
        description: 'Ignore time gap so that the booking item only have 1 timeslot to book',
        isPremium: 0,
      },
    ])
  }
}
