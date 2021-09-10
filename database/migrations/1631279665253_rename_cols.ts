import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DpoCols extends BaseSchema {
  protected tableName = 'dpo_cols'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropUnique(['related_table_id'], 'dpo_cols_dpo_table_id_column_related_table_id_unique')
      table.dropColumn('related_table_id')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {

    })
  }
}
