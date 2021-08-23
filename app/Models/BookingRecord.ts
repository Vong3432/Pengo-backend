import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, Has, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import BookingItem from './BookingItem'
import GooCard from './GooCard'
import Feedback from './Feedback'
import Penger from './Penger'

export default class BookingRecord extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => BookingItem)
  public item: BelongsTo<typeof BookingItem>

  @belongsTo(() => GooCard)
  public goocard: BelongsTo<typeof GooCard>

  @column({ columnName: 'booking_item_id' })
  public bookingItemId: Number

  @column({ columnName: 'penger_id' })
  public pengerId: Number

  @column({ columnName: 'goocard_id' })
  public gooCardId: Number

  @column()
  public bookTime: string

  @column.date()
  public bookDate: DateTime

  @column({
    serialize: (value: Number) => {
      return value === 1 ? true : false
    }
  })
  public isUsed: Number

  @hasMany(() => Feedback)
  public feedbacks: HasMany<typeof Feedback>

  @belongsTo(() => Penger)
  public penger: BelongsTo<typeof Penger>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
