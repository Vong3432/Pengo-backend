import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import GooCard from './GooCard'

export default class Coupon extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'created_by' })
  public pengerId: Number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public minCreditPoints: number

  @column()
  public requiredCreditPoints: number

  @column.dateTime()
  public validFrom: DateTime

  @column.dateTime()
  public validTo: DateTime

  @column()
  public quantity: number

  @column({
    serialize: (value: Number) => {
      return value === 1 ? true : false
    }
  })
  public isRedeemable: number

  @manyToMany(() => GooCard)
  public goocards: ManyToMany<typeof GooCard>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
