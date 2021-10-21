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
  public bookingItemId: number

  @column({ columnName: 'penger_id' })
  public pengerId: number

  @column({ columnName: 'goocard_id' })
  public gooCardId: number

  @column()
  public bookTime: string

  @column({
    serialize: (value: string | null) => {
      return value ? {
        start_date: JSON.parse(value).start_date,
        end_date: JSON.parse(value).end_date,
      } : value
    },
  })
  public bookDate: any

  @column({
    serialize: (value: number) => {
      return value === 1 ? true : false
    }
  })
  public isUsed: number

  @hasMany(() => Feedback)
  public feedbacks: HasMany<typeof Feedback>

  @belongsTo(() => Penger)
  public penger: BelongsTo<typeof Penger>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
