import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Coupons extends BaseSchema {
  protected tableName = 'coupons'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('is_scannable').unsigned().defaultTo(1)
      table.integer('is_selectable').unsigned().defaultTo(1)
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumns('is_scannable', 'is_selectable')
    })
  }
}
