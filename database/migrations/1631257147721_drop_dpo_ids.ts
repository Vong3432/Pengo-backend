import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PriorityOptions extends BaseSchema {
  protected tableName = 'priority_options'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      // table.dropForeign('dpo_id', 'priority_options_dpo_id_foreign')
      table.dropColumn('dpo_id')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
    })
  }
}
