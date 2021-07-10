import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingOptions extends BaseSchema {
  protected tableName = 'booking_options'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('booking_category_id').unsigned().references('booking_categories.id').onDelete('CASCADE')
      table.integer('system_function_id').unsigned().references('system_functions.id').onDelete('CASCADE')
      table.string('system_function_key').notNullable()
      table.integer('is_enable').unsigned().notNullable().defaultTo(1)
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
