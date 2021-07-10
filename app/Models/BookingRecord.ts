import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import BookingItem from './BookingItem'

export default class BookingRecord extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => BookingItem)
  public item: BelongsTo<typeof BookingItem>

  @column()
  public bookTime: string

  @column()
  public bookDate: Date

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
