import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.string('username').notNullable()
      table.string('phone').notNullable()
      table.string('avatar').notNullable()
      table.date('dob').nullable()
      table.integer('role_id').unsigned().references('id').inTable('roles')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('username')
      table.dropColumn('phone')
      table.dropColumn('avatar')
      table.dropColumn('dob')
      table.dropColumn('role_id')
    })
  }
}
