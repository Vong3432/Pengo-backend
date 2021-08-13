import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import PriorityOption from './PriorityOption'

export default class DefinedPriorityOption extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasMany(() => PriorityOption)
  public priorityOptions: HasMany<typeof PriorityOption>

  @column()
  public tableName: string

  @column()
  public column: string

  @column()
  public columnType: string

  @column()
  public relatedTable: string

  @column({
    serialize: (value: Number) => {
      return value === 1 ? true : false
    }
  })
  public isActive: Number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
