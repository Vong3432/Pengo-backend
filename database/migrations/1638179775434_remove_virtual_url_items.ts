import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingItems extends BaseSchema {
  protected tableName = 'booking_items'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('virtual_url')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
    })
  }
}
