import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingRecords extends BaseSchema {
  protected tableName = 'booking_records'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('book_time').alter();
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {

    })
  }
}
