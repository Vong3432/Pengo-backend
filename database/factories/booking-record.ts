import Factory from '@ioc:Adonis/Lucid/Factory'
import BookingRecord from 'App/Models/BookingRecord'

export const BookingRecordFactory = Factory
  .define(BookingRecord, ({ faker }) => {
    return {
        bookTime: "03:00",
        bookDate: faker.date.soon(1)
    }
  })
  .build()
