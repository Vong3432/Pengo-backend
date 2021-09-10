import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import BookingItem from './BookingItem'
import DpoCol from './DpoCol'
import Penger from './Penger'

export enum PRIORITY_CONDITIONS {
  LARGER = 'LARGER',
  LARGER_EQUAL = 'LARGER_EQUAL',
  EQUAL = 'EQUAL',
  LESSER = 'LESSER',
  LESSER_EQUAL = 'LESSER_EQUAL'
}

export default class PriorityOption extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'created_by' })
  public pengerId: number

  @belongsTo(() => Penger)
  public penger: BelongsTo<typeof Penger>

  @hasOne(() => DpoCol)
  public dpoCol: HasOne<typeof DpoCol>

  @column()
  public conditions: PRIORITY_CONDITIONS

  @column({
    serialize: (value: number) => {
      return value === 1 ? true : false
    }
  })
  public isActive: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => BookingItem)
  public bookingItem: HasOne<typeof BookingItem>
}
