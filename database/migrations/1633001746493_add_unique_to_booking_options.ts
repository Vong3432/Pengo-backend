import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingOptions extends BaseSchema {
  protected tableName = 'booking_options'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.unique(['booking_category_id', 'system_function_id'])
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropUnique(['booking_category_id', 'system_function_id'])
    })
  }
}
