import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { PRIORITY_CONDITIONS } from 'App/Models/PriorityOption'

export default class PriorityOptions extends BaseSchema {
  protected tableName = 'priority_options'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('dpo_col_id').unsigned().references('dpo_cols.id').onDelete('CASCADE')
      table.string('value').notNullable()
      table.enum('type', ['INT', 'STRING'])
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('dpo_col_id')
      table.dropColumn('dpo_col_id')
      table.dropColumns('value', 'type')
    })
  }
}
