import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PriorityOptions extends BaseSchema {
  protected tableName = 'priority_options'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('created_by').unsigned().references('pengers.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('created_by')
      table.dropColumn('created_by')
    })
  }
}
