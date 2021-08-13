import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DefinedPriorityOptions extends BaseSchema {
  protected tableName = 'defined_priority_options'

  public async up() {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('table_name').notNullable()
      table.string('column').notNullable()
      table.string('column_type').notNullable()
      table.string('related_table').nullable()
      table.integer('is_active').unsigned().notNullable().defaultTo(1)

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
