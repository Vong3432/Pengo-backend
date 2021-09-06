import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class SystemFunction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column({
    serialize: (value: number) => {
      return value === 1 ? true : false
    }
  })
  public isPremium: number

  @column({
    serialize: (value: number) => {
      return value === 1 ? true : false
    }
  })
  public isActive: number

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
