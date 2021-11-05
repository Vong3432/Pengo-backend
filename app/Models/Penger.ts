import { DateTime } from 'luxon'
import { BaseModel, beforeFetch, column, computed, HasMany, hasMany, HasManyThrough, hasManyThrough, hasOne, HasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import BookingOption from './BookingOption'
import BookingCategory from './BookingCategory'
import User from './User'
import BookingItem from './BookingItem'
import BookingCloseDate from './BookingCloseDate'
import Coupon from './Coupon'
import PengerLocation from './PengerLocation'
import BankAccount from './BankAccount'

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

  @hasMany(() => BankAccount, { serializeAs: "bank_accounts", foreignKey: "holderId" })
  public bankAccounts: HasMany<typeof BankAccount>

  @hasMany(() => BookingCloseDate, { serializeAs: 'close_dates' })
  public closeDates: HasMany<typeof BookingCloseDate>

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

  @hasMany(() => Coupon)
  public coupons: HasMany<typeof Coupon>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
