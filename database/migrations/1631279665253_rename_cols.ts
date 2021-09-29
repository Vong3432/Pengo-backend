import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DpoCols extends BaseSchema {
  protected tableName = 'dpo_cols'

  public async up() {
    this.schema.table(this.tableName, (table) => {

    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {

    })
  }
}
