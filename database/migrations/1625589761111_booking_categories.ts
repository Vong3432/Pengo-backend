import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingCategories extends BaseSchema {
  protected tableName = 'booking_categories'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.integer('created_by').unsigned().references('pengers.id').onDelete('CASCADE')
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
