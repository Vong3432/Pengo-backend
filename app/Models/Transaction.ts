import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import BankAccount from './BankAccount'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public metadata: any

  @column()
  public amount: number

  @column()
  public bankAccountId: number

  @column()
  public toBankAccountId: number

  @column({
    serialize: (value: number) => {
      return value === 1 ? true : false
    }
  })
  public isPaid: boolean

  @belongsTo(() => BankAccount)
  public bankAccount: BelongsTo<typeof BankAccount>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed({ serializeAs: 'gross_amount' })
  public get computed_amount() {
    return this.amount / 100
  }
}
