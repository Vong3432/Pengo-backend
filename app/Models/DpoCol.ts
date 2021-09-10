import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import DpoTable from './DpoTable'

export default class DpoCol extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'dpo_table_id' })
  public dpoTableId: number

  @belongsTo(() => DpoTable)
  public dpoTable: BelongsTo<typeof DpoTable>

  @column()
  public relatedTable: string

  @column()
  public column: string

  @column({
    serialize: (value: number) => {
      return value === 1 ? true : false
    }
  })
  public isActive: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
