import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import GooCardLog from './GooCardLog'
import BookingRecord from './BookingRecord'

export default class GooCard extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public pin: string

  @hasMany(() => GooCardLog)
  public logs: HasMany<typeof GooCardLog>

  @hasMany(() => BookingRecord)
  public records: HasMany<typeof BookingRecord>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
