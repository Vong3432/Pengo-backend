import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, HasManyThrough, hasManyThrough, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Location from './Location'
import BookingOption from './BookingOption'
import BookingCategory from './BookingCategory'
import User from './User'
import BookingItem from './BookingItem'

export default class Penger extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string | null

  @column()
  public logo: string

  @manyToMany(() => Location, {
    pivotTable: 'penger_location',
    pivotColumns: ['name']
  })
  public locations: ManyToMany<typeof Location>

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
  ])
  public bookingItems: HasManyThrough<typeof BookingItem>

  @manyToMany(() => User)
  public pengerUsers: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
