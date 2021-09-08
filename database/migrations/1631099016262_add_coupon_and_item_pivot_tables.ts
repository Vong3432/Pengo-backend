import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddCouponAndItemPivotTables extends BaseSchema {
  protected tableName = 'coupon_item'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('booking_item_id').unsigned().references('booking_items.id')
      table.integer('coupon_id').unsigned().references('coupons.id')
      table.unique(['booking_item_id', 'coupon_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
