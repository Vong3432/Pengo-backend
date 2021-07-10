import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class SystemFunction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column({serialize: (value: Number) => {
    return value === 1 ? true : false
  }})
  public isPremium: Number

  @column({serialize: (value: Number) => {
    return value === 1 ? true : false
  }})
  public isActive: Number

  @column()
  public price: Number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
