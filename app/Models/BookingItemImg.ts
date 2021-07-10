import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import BookingItem from './BookingItem'

export default class BookingItemImg extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public url: string

  @belongsTo(() => BookingItem)
  public bookingItem: BelongsTo<typeof BookingItem>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
