import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingOptions extends BaseSchema {
  protected tableName = 'booking_options'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('system_function_key');
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
    })
  }
}
