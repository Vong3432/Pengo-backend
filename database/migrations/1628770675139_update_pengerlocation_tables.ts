import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PengerLocation extends BaseSchema {
  protected tableName = 'penger_location'

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
