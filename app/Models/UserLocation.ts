import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserLocation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({
    serialize: (value: string | null) => {
      return value ? {
        latitude: JSON.parse(value).latitude,
        longitude: JSON.parse(value).longitude,
      } : value
    },
  })
  public geolocation: any

  @column()
  public address: string

  @column()
  public street: string

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
