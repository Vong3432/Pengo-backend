import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DpoCols extends BaseSchema {
  protected tableName = 'dpo_cols'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.unique(['dpo_table_id', 'column', 'related_table_id'])
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
    })
  }
}
