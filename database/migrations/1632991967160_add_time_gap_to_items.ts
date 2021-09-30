import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import TimeGapService from 'App/Services/core/TimeGapService'
import { TimeGapUnit } from 'Config/const'

export default class BookingItems extends BaseSchema {
  protected tableName = 'booking_items'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.enum('time_gap_units', TimeGapService.getTimeUnits()).defaultTo(TimeGapUnit.MINUTES)
      table.integer('time_gap_value').unsigned().defaultTo(10)
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumns('time_gap_units', 'time_gap_value')
    })
  }
}
