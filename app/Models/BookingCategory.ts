import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import BookingOption from './BookingOption'
import BookingItem from './BookingItem'
import User from './User'
import Penger from './Penger'

export default class BookingCategory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @hasMany(() => BookingOption)
  public bookingOptions: HasMany<typeof BookingOption>

  @hasMany(() => BookingItem)
  public bookingItems: HasMany<typeof BookingItem>

  @belongsTo(() => Penger)
  public createdBy: BelongsTo<typeof Penger>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
