import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingItemImgs extends BaseSchema {
  protected tableName = 'booking_item_imgs'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('booking_item_id').unsigned().references('booking_items.id').onDelete('CASCADE')
      table.string('url').notNullable()
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
