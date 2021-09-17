import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import DpoTable from './DpoTable'
import PriorityOption from './PriorityOption'

export default class DpoCol extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'dpo_table_id' })
  public dpoTableId: number

  @belongsTo(() => DpoTable, { serializeAs: 'dpo_table' })
  public dpoTable: BelongsTo<typeof DpoTable>

  @hasOne(() => PriorityOption)
  public priorityOption: HasOne<typeof PriorityOption>

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
