import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class GoocardCoupons extends BaseSchema {
  protected tableName = 'goocard_coupon'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('goocard_id').unsigned().references('goo_cards.id').onDelete('CASCADE')
      table.integer('coupon_id').unsigned().references('coupons.id').onDelete('CASCADE')
      table.integer('is_used').unsigned().notNullable().defaultTo(0)

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
