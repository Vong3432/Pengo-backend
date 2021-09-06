import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import BookingItem from './BookingItem'

enum PRIORITY_CONDITIONS {
  LARGER = 'LARGER',
  LARGER_EQUAL = 'LARGER_EQUAL',
  EQUAL = 'EQUAL',
  LESSER = 'LESSER',
  LESSER_EQUAL = 'LESSER_EQUAL'
}

export default class PriorityOption extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public dpoId: number

  @column()
  public column: string

  @column()
  public strValue: string

  @column()
  public intValue: number

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
