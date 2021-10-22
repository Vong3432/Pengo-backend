import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Transactions extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('to_bank_account_id').unsigned().notNullable()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
    })
  }
}
