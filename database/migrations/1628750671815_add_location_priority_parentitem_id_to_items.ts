import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingItems extends BaseSchema {
  protected tableName = 'booking_items'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('parent_booking_item').unsigned().nullable()
      table.integer('priority_option_id').unsigned().nullable().references('priority_options.id')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('location_id')
      table.dropColumn('parent_booking_item')
      table.dropColumn('priority_option_id')
    })
  }
}
