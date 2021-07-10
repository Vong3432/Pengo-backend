import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PengerUsers extends BaseSchema {
  protected tableName = 'penger_user'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('users.id')
      table.integer('penger_id').unsigned().references('pengers.id')
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
