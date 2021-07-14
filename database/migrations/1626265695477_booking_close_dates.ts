import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export const CLOSE_TYPES = ['ITEM', 'CATEGORY', 'ORGANIZATION']


export default class BookingCloseDates extends BaseSchema {
  protected tableName = 'booking_close_dates'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('penger_id').unsigned().references('pengers.id').onDelete('CASCADE')
      table.enum('type', CLOSE_TYPES)
      table.integer('key_id').unsigned()
      table.date('from').nullable()
      table.date('to').nullable()
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
