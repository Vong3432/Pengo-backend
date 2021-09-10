import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DefinedPriorityOptions extends BaseSchema {
  protected tableName = 'defined_priority_options'

  public async up() {
    this.schema.dropTable(this.tableName)
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
    })
  }
}
