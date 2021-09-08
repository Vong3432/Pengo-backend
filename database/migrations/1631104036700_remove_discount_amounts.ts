import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Coupons extends BaseSchema {
  protected tableName = 'coupons'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('discount_amount');
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
    })
  }
}
