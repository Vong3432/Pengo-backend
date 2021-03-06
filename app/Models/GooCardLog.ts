import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export enum GoocardLogType {
  COUPON = "coupon",
  PASS = "pass"
}

export default class GooCardLog extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'goocard_id' })
  public gooCardId: number

  @column()
  public title: string

  @column()
  public body: string

  @column()
  public type: GoocardLogType

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
