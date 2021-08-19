import { DateTime } from 'luxon'
import { BaseModel, beforeFetch, column, HasMany, hasMany, HasManyThrough, hasManyThrough, hasOne, HasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import BookingOption from './BookingOption'
import BookingCategory from './BookingCategory'
import User from './User'
import BookingItem from './BookingItem'
import BookingCloseDate from './BookingCloseDate'
import Coupon from './Coupon'
import PengerLocation from './PengerLocation'

export default class Penger extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string | null

  @column()
  public logo: string

  @hasOne(() => PengerLocation)
  public location: HasOne<typeof PengerLocation>


  @hasMany(() => BookingCategory)
  public bookingCategories: HasMany<typeof BookingCategory>

  @hasManyThrough([
    () => BookingOption,
    () => BookingCategory
  ])
  public bookingOptions: HasManyThrough<typeof BookingOption>

  @hasManyThrough([
    () => BookingItem,
    () => BookingCategory
  ], {
    serializeAs: 'booking_items'
  })
  public bookingItems: HasManyThrough<typeof BookingItem>

  @manyToMany(() => User)
  public pengerUsers: ManyToMany<typeof User>

  @hasMany(() => BookingCloseDate)
  public closeDates: HasMany<typeof BookingCloseDate>

  @hasMany(() => Coupon)
  public coupons: HasMany<typeof Coupon>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
