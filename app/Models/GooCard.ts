import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import GooCardLog from './GooCardLog'
import BookingRecord from './BookingRecord'
import User from './User'

export default class GooCard extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: Number

  @column()
  public pin: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => GooCardLog)
  public logs: HasMany<typeof GooCardLog>

  @hasMany(() => BookingRecord)
  public records: HasMany<typeof BookingRecord>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
