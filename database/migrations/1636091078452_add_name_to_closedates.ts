import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingCloseDates extends BaseSchema {
  protected tableName = 'booking_close_dates'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('name').notNullable()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
    })
  }
}
