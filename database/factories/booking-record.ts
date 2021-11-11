import Factory from '@ioc:Adonis/Lucid/Factory'
import BookingRecord from 'App/Models/BookingRecord'
import { DateTime } from 'luxon'
import { BookingItemFactory } from './booking-item'

export const BookingRecordFactory = Factory
  .define(BookingRecord, ({ faker }) => {
    return {
      bookTime: "03:00 PM",
      bookDate: JSON.stringify({
        "start_date": "2021-11-07T00:00:00.000+08:00",
        "end_date": "2021-11-10T00:00:00.000+08:00"
      })
    }
  })
  .relation('item', () => BookingItemFactory)
  .build()
