import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Transactions extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.json("metadata").nullable()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
    })
  }
}
