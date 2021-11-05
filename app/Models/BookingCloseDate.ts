import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export enum CloseDateType {
  // Item = 'ITEM',
  Organization = 'ORGANIZATION',
  // Category = 'CATEGORY'
}


export default class BookingCloseDate extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: CloseDateType

  @column()
  public pengerId: number

  @column()
  public name: string

  /**
   * Used as query
   */
  @column()
  public keyId: number

  @column.date()
  public from: DateTime

  @column.date()
  public to: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
