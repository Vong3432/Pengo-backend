import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { GoocardLogType } from 'App/Models/GooCardLog'

export default class GooCardLogs extends BaseSchema {
  protected tableName = 'goo_card_logs'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.enum('type', [GoocardLogType.COUPON, GoocardLogType.PASS])
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('type')
    })
  }
}
