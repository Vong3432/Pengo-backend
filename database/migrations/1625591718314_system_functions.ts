import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SystemFunctions extends BaseSchema {
  protected tableName = 'system_functions'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.integer('is_premium').unsigned().notNullable().defaultTo(0)
      table.integer('is_active').unsigned().notNullable().defaultTo(1)
      table.decimal('price').notNullable().defaultTo(0)
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
