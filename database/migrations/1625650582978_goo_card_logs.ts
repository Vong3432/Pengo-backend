import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class GooCardLogs extends BaseSchema {
  protected tableName = 'goo_card_logs'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('goocard_id').unsigned().references('goocards.id').onDelete('CASCADE')
      table.string('title').notNullable()
      table.string('body').nullable()
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
