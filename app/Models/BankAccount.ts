import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Transaction from './Transaction'
import GooCard from './GooCard'
import Penger from './Penger'

export enum BankAccountType {
  GOOCARD = "goocard",
  PENGER = "penger"
}

export default class BankAccount extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  /** 
   * Track account from third-party payment gateway SDK.
  */
  @column()
  public uniqueId: string

  @column({ columnName: "holder_id" })
  public gooCardId: number

  @column({ columnName: "holder_id" })
  public pengerId: number

  @column()
  public type: BankAccountType

  @column({ columnName: 'holder_id' })
  public holderId: string

  @belongsTo(() => GooCard, { foreignKey: "holder_id" })
  public goocard: BelongsTo<typeof GooCard>

  @belongsTo(() => Penger, { foreignKey: "holder_id" })
  public penger: BelongsTo<typeof Penger>


  @hasMany(() => Transaction)
  public transactions: HasMany<typeof Transaction>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
