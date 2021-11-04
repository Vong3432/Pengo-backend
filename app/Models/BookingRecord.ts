import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed, Has, HasMany, hasMany, HasManyThrough, hasManyThrough } from '@ioc:Adonis/Lucid/Orm'
import BookingItem from './BookingItem'
import GooCard from './GooCard'
import Feedback from './Feedback'
import Penger from './Penger'
import User from './User'

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

  @computed({ serializeAs: 'group_date' })
  public get groupDate() {

    const serialized = JSON.parse(this.bookDate)

    // iso string
    const groupDate: string = serialized['start_date'] ?? serialized['end_date']

    // format
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };

    // formatted
    const formattedDate = new Date(groupDate).toLocaleString('en-MY', options)

    return formattedDate
  };
}
