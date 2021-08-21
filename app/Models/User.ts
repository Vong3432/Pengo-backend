import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, BelongsTo, column, HasOne, hasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import GooCard from './GooCard'
import Role from './Role'
import Notification from './Notification'
import Penger from './Penger'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  // hide property
  @column({ serializeAs: null })
  public password: string

  @column()
  public phone: string

  @column()
  public email: string

  @column()
  public avatar: string

  @column()
  public dob: Date

  @column({ columnName: 'role_id' })
  public roleId: Number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => GooCard)
  public goocard: HasOne<typeof GooCard>

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @manyToMany(() => Notification, {
    pivotTable: 'notification_user',
    pivotColumns: ['is_read', 'is_sent', 'send_at']
  })
  public notifications: ManyToMany<typeof Notification>

  @manyToMany(() => Penger)
  public pengerUsers: ManyToMany<typeof Penger>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
