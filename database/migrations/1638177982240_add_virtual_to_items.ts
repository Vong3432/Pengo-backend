import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingItems extends BaseSchema {
  protected tableName = 'booking_items'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('is_virtual').unsigned().defaultTo(0)
      table.string('virtual_url').nullable()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
    })
  }
}
