import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserLocation extends BaseSchema {
  protected tableName = 'user_location'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.json('geolocation');
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
    })
  }
}
