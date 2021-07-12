import Factory from '@ioc:Adonis/Lucid/Factory'
import BookingCategory from 'App/Models/BookingCategory';
import { BookingItemFactory } from './booking-item';

export const BookingCategoryFactory = Factory
  .define(BookingCategory, ({ faker }) => {
    return {
        name: faker.lorem.word()
    }
  })
  .relation('bookingItems', () => BookingItemFactory)
  .build()
