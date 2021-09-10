import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DpoCols extends BaseSchema {
  protected tableName = 'dpo_cols'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('related_table').nullable()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('related_table')
    })
  }
}
