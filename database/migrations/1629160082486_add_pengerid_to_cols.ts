import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingRecords extends BaseSchema {
  protected tableName = 'booking_records'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('penger_id').unsigned().references('pengers.id').onDelete('CASCADE');
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('penger_id')
    })
  }
}
