import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class GooCards extends BaseSchema {
  protected tableName = 'goo_cards'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('pin').notNullable()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
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
