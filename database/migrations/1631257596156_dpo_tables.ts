import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DpoTables extends BaseSchema {
  protected tableName = 'dpo_tables'

  public async up() {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('table_name').unique().notNullable()
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
