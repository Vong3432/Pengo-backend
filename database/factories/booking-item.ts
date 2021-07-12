import Factory from '@ioc:Adonis/Lucid/Factory'
import BookingItem from 'App/Models/BookingItem'

export const BookingItemFactory = Factory
  .define(BookingItem, ({ faker }) => {
    return {
        posterUrl: faker.image.image(),
		name: "Event 1",
		description: faker.lorem.paragraph(),
		maximum_book: faker.datatype.number({min: 0, max: 10}),
		maximum_transfer: faker.datatype.number({min: 0, max: 10}),
		preserved_book: faker.datatype.number({min: 0, max: 10}),
		credit_points: faker.datatype.number({min: 0, max: 100}),
		is_preservable: 0,
		is_active: 1,
		is_transferable: 0,
		is_countable: 0,
		is_discountable: 0,
		quantity: faker.datatype.number({min: 0, max: 20}),
		price: faker.datatype.number({min: 0, max: 100}),
		discount_amount: faker.datatype.number({min: 0, max: 50}),
		available_from_time: "10:00",
		available_to_time: "23:59",
		start_from: "2021-01-01 00:00:00",
		end_at: "2021-01-02 23:59:59",
    }
  })
  .state('discount', (item) => {
      item.isDiscountable = 1;
  })
  .state('transfer', (item) => {
      item.isTransferable = 1;
  })
  .state('countable', (item) => {
      item.isCountable = 1;
  })
  .state('deactive', (item) => {
	  item.isActive = 0;
  })
  .build()
