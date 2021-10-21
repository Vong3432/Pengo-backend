import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany, HasManyThrough, hasManyThrough, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import BookingRecord from './BookingRecord'
import BookingItemImg from './BookingItemImg'
import BookingCategory from './BookingCategory'
import Coupon from './Coupon'
import PriorityOption from './PriorityOption'
import { TimeGapUnit } from 'Config/const'
import Penger from './Penger'

export default class BookingItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public bookingCategoryId: number

  @column()
  public locationId: number

  @column()
  public parentBookingItem: number

  @column()
  public priorityOptionId: number

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
  public maximumBook: number

  @column()
  public maximumTransfer: number

  @column()
  public preservedBook: number

  @column()
  public creditPoints: number

  @column()
  public timeGapValue: number

  @column()
  public timeGapUnits: TimeGapUnit

  @column({
    serialize: (value: number) => {
      return value === 1 ? true : false
    }
  })
  public isPreservable: number

  @column({
    serialize: (value: number) => {
      return value === 1 ? true : false
    }
  })
  public isActive: number

  @column({
    serialize: (value: number) => {
      return value === 1 ? true : false
    }
  })
  public isBookable: number

  @column({
    serialize: (value: number) => {
      return value === 1 ? true : false
    }
  })
  public isTransferable: number

  @column({
    serialize: (value: number) => {
      return value === 1 ? true : false
    }
  })
  public isCountable: number

  @column({
    serialize: (value: number) => {
      return value === 1 ? true : false
    }
  })
  public isDiscountable: number

  @column()
  public quantity: number

  @column()
  public price: number

  @column()
  public discountAmount: number

  @column.dateTime()
  public availableFromTime: DateTime

  @column.dateTime()
  public availableToTime: DateTime

  @column.dateTime()
  public startFrom: DateTime

  @column.dateTime()
  public endAt: DateTime

  @manyToMany(() => Coupon, {
    pivotTable: 'coupon_item'
  })
  public coupons: ManyToMany<typeof Coupon>

  @column({
    serialize: (val: string | null) => {
      return val ? JSON.parse(val) : val
    }
  })
  public geolocation: string

  @hasMany(() => BookingRecord)
  public records: HasMany<typeof BookingRecord>

  @belongsTo(() => BookingCategory)
  public category: BelongsTo<typeof BookingCategory>

  @belongsTo(() => PriorityOption, { serializeAs: 'priority_option' })
  public priorityOption: BelongsTo<typeof PriorityOption>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
