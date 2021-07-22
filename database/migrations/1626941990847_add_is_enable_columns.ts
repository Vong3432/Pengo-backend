import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingCategories extends BaseSchema {
  protected tableName = 'booking_categories'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('is_enable').unsigned().notNullable().defaultTo(1)
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('is_enable')
    })
  }
}
