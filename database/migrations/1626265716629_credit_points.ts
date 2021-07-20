import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreditPoints extends BaseSchema {
  protected tableName = 'credit_points'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('goocard_id').unsigned().references('goo_cards.id').onDelete('CASCADE')
      table.integer('penger_id').unsigned().references('pengers.id')
      table.decimal('total_credit_points').defaultTo(0)
      table.decimal('available_credit_points').defaultTo(0)

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
