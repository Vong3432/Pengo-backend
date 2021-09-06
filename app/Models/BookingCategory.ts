import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import BookingOption from './BookingOption'
import BookingItem from './BookingItem'
import Penger from './Penger'

export default class BookingCategory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({
    serialize: (value: number) => {
      return value === 1 ? true : false
    }
  })
  public isEnable: number

  @hasMany(() => BookingOption)
  public bookingOptions: HasMany<typeof BookingOption>

  @hasMany(() => BookingItem, { serializeAs: 'booking_items' })
  public bookingItems: HasMany<typeof BookingItem>

  @column({ columnName: 'created_by', serializeAs: null })
  public pengerId: number

  @belongsTo(() => Penger)
  public createdBy: BelongsTo<typeof Penger>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
