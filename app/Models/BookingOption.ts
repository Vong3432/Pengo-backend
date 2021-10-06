import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import SystemFunction from './SystemFunction'
import BookingCategory from './BookingCategory'

export default class BookingOption extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public systemFunctionId: number

  @column()
  public bookingCategoryId: number

  @column({
    serialize: (num: number) => {
      return num === 1 ? true : false
    }
  })
  public isEnable: number

  @hasOne(() => SystemFunction, { serializeAs: 'system_function' })
  public systemFunction: HasOne<typeof SystemFunction>

  @belongsTo(() => BookingCategory, { serializeAs: 'booking_category' })
  public bookingCategory: BelongsTo<typeof BookingCategory>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
