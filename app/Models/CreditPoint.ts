import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CreditPoint extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'goocard_id' })
  public goocardId: number

  @column({ columnName: 'penger_id' })
  public pengerId: number

  @column()
  public totalCreditPoints: number
  @column()

  public availableCreditPoints: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
