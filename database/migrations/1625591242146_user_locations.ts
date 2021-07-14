import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserLocations extends BaseSchema {
  protected tableName = 'user_location'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.integer('user_id').unsigned().references('users.id')
      table.integer('location_id').unsigned().references('locations.id')
      
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
