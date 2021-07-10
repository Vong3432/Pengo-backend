import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingItems extends BaseSchema {
  protected tableName = 'booking_items'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('booking_category_id').unsigned().references('booking_categories.id')
      table.string('unique_id').notNullable().unique()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.string('poster_url').notNullable()
      // table.string('subimage').notNullable()
      table.decimal('credit_points').defaultTo(0)
      table.integer('maximum_book').unsigned().nullable()
      table.integer('maximum_trans').unsigned().nullable()
      table.integer('preserved_book').unsigned().nullable()
      table.integer('is_preservedable').unsigned().defaultTo(0)
      table.integer('is_active').unsigned().defaultTo(1)
      table.integer('is_bookable').unsigned().defaultTo(1)
      table.integer('is_transferable').unsigned().defaultTo(0)
      table.integer('is_countable').unsigned().defaultTo(0)
      table.integer('is_discountable').unsigned().defaultTo(0)
      table.decimal('discount_amount').defaultTo(0)
      table.integer('quantity').unsigned().nullable()
      table.decimal('price').nullable()
      table.time('available_from_time').nullable()
      table.time('available_to_time').nullable()
      table.dateTime('start_from', {precision: 6})
      table.dateTime('end_at', {precision: 6})
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
