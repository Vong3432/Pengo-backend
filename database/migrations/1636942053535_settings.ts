import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Settings extends BaseSchema {
  protected tableName = 'settings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('key').unique().notNullable()
      table.string('name').notNullable()
      table.string('value').notNullable()
      table.integer('is_active').unsigned().defaultTo(1)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
