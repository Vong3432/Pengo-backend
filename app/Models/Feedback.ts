import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import BookingRecord from './BookingRecord'

export default class Feedback extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'record_id' })
  public bookingRecordId: number

  @belongsTo(() => BookingRecord)
  public record: BelongsTo<typeof BookingRecord>

  @column()
  public title: string

  @column()
  public category: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
