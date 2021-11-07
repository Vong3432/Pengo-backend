import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingRecords extends BaseSchema {
  protected tableName = 'booking_records'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.decimal("reward_point", 8, 2).notNullable().defaultTo(0)
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("reward_point")
    })
  }
}
