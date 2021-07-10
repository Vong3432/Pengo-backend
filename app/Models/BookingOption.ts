import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import SystemFunction from './SystemFunction'

export default class BookingOption extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public systemFunctionKey: string

  @column({ serialize: (num: Number) => {
    return num === 1 ? true : false
  }})
  public isEnable: Number

  @hasOne(() => SystemFunction)
  public systemFunction: HasOne<typeof SystemFunction>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
