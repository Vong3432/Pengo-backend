import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import BookingRecord from './BookingRecord'
import BookingItemImg from './BookingItemImg'
import BookingCategory from './BookingCategory'

export default class BookingItem extends BaseModel {
  @column({ isPrimary: true })
  public id: Number

  @column()
  public bookingCategoryId: Number

  @column()
  public locationId: Number

  @column()
  public parentBookingItem: Number

  @column()
  public priorityOptionId: Number

  @column()
  public uniqueId: string

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public posterUrl: string

  @hasMany(() => BookingItemImg)
  public subImages: HasMany<typeof BookingItemImg>

  @column()
  public maximumBook: Number

  @column()
  public maximumTransfer: Number

  @column()
  public preservedBook: Number

  @column()
  public creditPoints: Number

  @column({
    serialize: (value: Number) => {
      return value === 1 ? true : false
    }
  })
  public isPreservable: Number

  @column({
    serialize: (value: Number) => {
      return value === 1 ? true : false
    }
  })
  public isActive: Number

  @column({
    serialize: (value: Number) => {
      return value === 1 ? true : false
    }
  })
  public isBookable: Number

  @column({
    serialize: (value: Number) => {
      return value === 1 ? true : false
    }
  })
  public isTransferable: Number

  @column({
    serialize: (value: Number) => {
      return value === 1 ? true : false
    }
  })
  public isCountable: Number

  @column({
    serialize: (value: Number) => {
      return value === 1 ? true : false
    }
  })
  public isDiscountable: Number

  @column()
  public quantity: Number

  @column()
  public price: Number

  @column()
  public discountAmount: Number

  @column.dateTime()
  public availableFromTime: DateTime

  @column.dateTime()
  public availableToTime: DateTime

  @column.dateTime()
  public startFrom: DateTime

  @column.dateTime()
  public endAt: DateTime

  @column()
  public geolocation: string

  @hasMany(() => BookingRecord)
  public records: HasMany<typeof BookingRecord>

  @belongsTo(() => BookingCategory)
  public category: BelongsTo<typeof BookingCategory>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
