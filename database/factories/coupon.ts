import Factory from '@ioc:Adonis/Lucid/Factory'
import Coupon from 'App/Models/Coupon'
import { DateTime } from 'luxon'
import { BookingItemFactory } from './booking-item'
import { GooCardFactory } from './goocard'

export const CouponFactory = Factory
	.define(Coupon, ({ faker }) => {
		return {
			title: faker.lorem.words(3),
			description: faker.lorem.paragraph(),
			min_credit_points: 1000,
			required_credit_points: 1000,
			quantity: 10,
			is_redeemable: 1,
			valid_from: "2021-01-01 00:00:00",
			valid_to: "2022-01-02 23:59:59",
			discount_percentage: 0,
		}
	})
	.relation('goocards', () => GooCardFactory)
	.relation('bookingItems', () => BookingItemFactory)
	.state('outOfStock', (coupon) => {
		coupon.quantity = 0
	})
	.state('discount', (coupon) => {
		coupon.discountPercentage = 10
	})
	.state('notRedeemable', (coupon) => {
		coupon.isRedeemable = 0
	})
	.state('expired', (coupon) => {
		coupon.validTo = DateTime.fromSQL("2020-01-02 23:59:59")
	})
	.build()
