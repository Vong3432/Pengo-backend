import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany, HasOne, hasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import GooCardLog from './GooCardLog'
import BookingRecord from './BookingRecord'
import User from './User'
import Coupon from './Coupon'
import CreditPoint from './CreditPoint'

export default class GooCard extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public pin: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasOne(() => CreditPoint)
  public creditPoints: HasOne<typeof CreditPoint>

  @hasMany(() => GooCardLog)
  public logs: HasMany<typeof GooCardLog>

  @hasMany(() => BookingRecord)
  public records: HasMany<typeof BookingRecord>

  @manyToMany(() => Coupon, {
    pivotTable: 'goocard_coupon',
    pivotForeignKey: 'goocard_id',
    pivotColumns: ['is_used']
  })
  public coupons: ManyToMany<typeof Coupon>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
