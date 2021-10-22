import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Transactions extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer("is_paid").unsigned().defaultTo(0).alter()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
    })
  }
}
