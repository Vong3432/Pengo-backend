import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer("age").unsigned().notNullable();
      table.dropColumn("dob");
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("age")
    })
  }
}
