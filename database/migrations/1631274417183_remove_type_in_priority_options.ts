import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PriorityOptions extends BaseSchema {
  protected tableName = 'priority_options'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('type')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
    })
  }
}
