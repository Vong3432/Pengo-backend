import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingItems extends BaseSchema {
  protected tableName = 'booking_items'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.json('geolocation').nullable();
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('geolocation')
    })
  }
}
