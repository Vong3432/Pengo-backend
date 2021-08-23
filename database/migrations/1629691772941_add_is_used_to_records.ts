import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingRecords extends BaseSchema {
  protected tableName = 'booking_records'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('is_used').unsigned().defaultTo(0);
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('is_used');
    })
  }
}
