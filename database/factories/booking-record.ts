import Factory from '@ioc:Adonis/Lucid/Factory'
import BookingRecord from 'App/Models/BookingRecord'
import { DateTime } from 'luxon'
import { BookingItemFactory } from './booking-item'

export const BookingRecordFactory = Factory
  .define(BookingRecord, ({ faker }) => {
    return {
      bookTime: "03:00",
      bookDate: DateTime.local(),
    }
  })
  .relation('item', () => BookingItemFactory)
  .build()
