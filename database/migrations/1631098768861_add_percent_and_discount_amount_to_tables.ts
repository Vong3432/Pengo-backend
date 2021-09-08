import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Coupons extends BaseSchema {
  protected tableName = 'coupons'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.decimal('discount_percentage', 5, 2).defaultTo(0)
      table.decimal('discount_amount').defaultTo(0)
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumns('discount_percentage', 'discount_amount')
    })
  }
}
