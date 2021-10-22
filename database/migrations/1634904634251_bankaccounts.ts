import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { BankAccountType } from 'App/Models/BankAccount'

export default class Bankaccounts extends BaseSchema {
  protected tableName = 'bank_accounts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('unique_id').notNullable()
      table.enum('type', [BankAccountType.GOOCARD, BankAccountType.PENGER]).notNullable()
      table.integer('holder_id').unsigned().notNullable()

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
