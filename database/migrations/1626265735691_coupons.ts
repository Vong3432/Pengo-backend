import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Coupons extends BaseSchema {
  protected tableName = 'coupons'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('created_by').unsigned().references('pengers.id').onDelete('CASCADE')
      table.string('title').notNullable()
      table.text('description').nullable()
      table.decimal('min_credit_points').nullable()
      table.decimal('required_credit_points').nullable()
      table.dateTime('valid_from').notNullable()
      table.dateTime('valid_to').notNullable()
      table.integer('quantity').unsigned()
      table.integer('is_redeemable').unsigned().notNullable().defaultTo(1)
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
