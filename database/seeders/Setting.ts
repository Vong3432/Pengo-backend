import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Setting from 'App/Models/Setting'

export default class SettingSeeder extends BaseSeeder {
  public async run() {

    const uniqueKey = 'key'

    // Write your database queries inside the run method
    await Setting.updateOrCreateMany(uniqueKey, [
      {
        key: 'stripe_charge_rate',
        name: 'Stripe charge rate',
        value: "3"
      },
    ])
  }
}
