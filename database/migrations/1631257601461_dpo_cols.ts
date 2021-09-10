import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DpoCols extends BaseSchema {
  protected tableName = 'dpo_cols'

  public async up() {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('dpo_table_id').unsigned().references('dpo_tables.id').onDelete('CASCADE')
      table.integer('related_table_id').unsigned().nullable()
      table.string('column').notNullable()
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
