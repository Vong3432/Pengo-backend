import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, HasManyThrough, hasManyThrough } from '@ioc:Adonis/Lucid/Orm'
import Location from './Location'
import BookingOption from './BookingOption'
import BookingCategory from './BookingCategory'
import User from './User'

export default class Penger extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string | null

  @column()
  public logo: string

  @hasMany(() => Location)
  public locations: HasMany<typeof Location>

  @hasManyThrough([
    () => BookingOption,
    () => BookingCategory
  ])
  public bookingOptions: HasManyThrough<typeof BookingOption>

  @hasMany(() => User)
  public pengerUsers: HasMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
