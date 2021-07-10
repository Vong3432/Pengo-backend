import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingRecords extends BaseSchema {
  protected tableName = 'booking_records'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('goocard_id').unsigned().references('goocards.id').onDelete('CASCADE')
      table.integer('booking_item_id').unsigned().references('booking_items.id')
      table.time('book_time').notNullable()
      table.date('book_date').notNullable()
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
