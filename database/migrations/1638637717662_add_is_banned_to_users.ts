import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('is_banned').unsigned().defaultTo(0)
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
    })
  }
}
