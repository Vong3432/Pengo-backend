import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import DpoCol from './DpoCol'

export default class DpoTable extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public tableName: string

  @column({
    serialize: (value: number) => {
      return value === 1 ? true : false
    }
  })
  public isActive: number

  @hasMany(() => DpoCol)
  public dpoCols: HasMany<typeof DpoCol>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
