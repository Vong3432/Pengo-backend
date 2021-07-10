import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export enum Roles {
  Pengoo = 'pengoo',
  Staff = 'penger_staff',
  Founder = 'penger',
  Admin = 'admin'
}

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({serialize: (value: Number) => {
    return value === 1 ? true : false
  }})
  public isActive: Number

  @hasMany(()=>User, {
    foreignKey: 'roleID'
  })
  public users: HasMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
