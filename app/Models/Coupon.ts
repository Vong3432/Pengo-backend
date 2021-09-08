import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import GooCard from './GooCard'
import BookingItem from './BookingItem'

export default class Coupon extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'created_by' })
  public pengerId: number

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

  @column()
  public discountPercentage: number

  // @column()
  // public discountAmount: number

  @column({
    serialize: (value: number) => {
      return value === 1 ? true : false
    }
  })
  public isRedeemable: number

  @manyToMany(() => GooCard)
  public goocards: ManyToMany<typeof GooCard>

  @manyToMany(() => BookingItem, {
    pivotTable: 'coupon_item'
  })
  public bookingItems: ManyToMany<typeof BookingItem>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
