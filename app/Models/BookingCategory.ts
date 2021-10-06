import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import BookingItem from './BookingItem'
import Penger from './Penger'
import SystemFunction from './SystemFunction'

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

  // @hasMany(() => BookingOption, { serializeAs: 'booking_options' })
  // public bookingOptions: HasMany<typeof BookingOption>

  @hasMany(() => BookingItem, { serializeAs: 'booking_items' })
  public bookingItems: HasMany<typeof BookingItem>

  @manyToMany(() => SystemFunction, {
    serializeAs: 'booking_options',
    pivotTable: 'booking_options',
    pivotForeignKey: 'booking_category_id',
    pivotRelatedForeignKey: 'system_function_id',
    pivotColumns: ['is_enable', 'created_at', 'updated_at']
  })
  public bookingOptions: ManyToMany<typeof SystemFunction>

  @column({ columnName: 'created_by', serializeAs: null })
  public pengerId: number

  @belongsTo(() => Penger)
  public createdBy: BelongsTo<typeof Penger>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
