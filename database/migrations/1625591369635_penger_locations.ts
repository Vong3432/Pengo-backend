import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PengerLocations extends BaseSchema {
  protected tableName = 'penger_location'

  public async up() {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.integer('penger_id').unsigned().references('pengers.id')
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
