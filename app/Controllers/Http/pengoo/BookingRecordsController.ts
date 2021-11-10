import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookingRecord from 'App/Models/BookingRecord';
import BookingRecordClientService from 'App/Services/booking/BookingRecordClientService';
import GeoService from 'App/Services/GeoService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';
import { DateTime } from 'luxon';

export default class BookingRecordsController {

  public async index(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const records = await BookingRecordClientService.findAll(contract);
      return SuccessResponse({ response, data: records })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error.message })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const record = await BookingRecordClientService.create(contract);
      return SuccessResponse({ response, msg: 'Booked successfully', data: record })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error.message })
    }
  }

  public async show(contract: HttpContextContract) {
    const { response, request, auth } = contract;
    try {
      const record = await BookingRecordClientService.findById(request.param('id'), auth);

      if (request.qs().show_stats == 1) {
        const todayDT: DateTime = DateTime.now().toLocal()
        const formattedToday = todayDT.toFormat("yyyy-MM-dd HH:mm")

        const records = await BookingRecord
          .query()
          .where('id', '!=', record.id)
          .where('booking_item_id', record.bookingItemId);

        // // format and compare book time
        let aheadUsersCount = 0;

        // // format and concate `current` user record
        const formattedBookTime = DateTime.fromFormat(record.bookTime, "h:mm a").toFormat("HH:mm")
        const formattedStartDate = DateTime.fromISO(record.serialize()['book_date']['start_date']).toFormat('yyyy-MM-dd') + " " + formattedBookTime
        const concatDT = DateTime.fromFormat(formattedStartDate, "yyyy-MM-dd HH:mm")

        // // format and concate `other` users' record
        // // if `other` users book earlier than `current` user, 
        // // then increment aheadUsersCount variable.
        for (const other of records) {
          const serialized = other.serialize()
          const time = other.bookTime
          const formattedBookTimeFromOther = DateTime.fromFormat(time, "h:mm a").toFormat("HH:mm")
          let formattedStartDateFromOther = DateTime.fromISO(serialized['book_date']['start_date']).toFormat('yyyy-MM-dd')

          // check if same date with `current` user's booking date, if same, then continue
          if (formattedStartDateFromOther === formattedToday) {
            // concat with book time since is same day
            formattedStartDateFromOther = formattedStartDateFromOther + " " + formattedBookTimeFromOther
            const concatDTFromOther = DateTime.fromFormat(formattedStartDateFromOther, "yyyy-MM-dd HH:mm")

            // if is earlier
            if (concatDTFromOther < concatDT) {
              aheadUsersCount++;
            }
          }
        }

        const itemGeo = JSON.parse(record.item.geolocation)
        const streetAddress = await GeoService.coordinateToStreet(itemGeo['latitude'], itemGeo['longitude'])

        return SuccessResponse({
          response, data: {
            ...record.serialize(),
            formatted_book_datetime: concatDT,
            ahead_user_count: aheadUsersCount,
            street_address: streetAddress,
          }
        })

      }

      return SuccessResponse({ response, data: record })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error.message })
    }
  }

  public async update(contract: HttpContextContract) {
    const { response } = contract;
    try {
      await BookingRecordClientService.update(contract);
      return SuccessResponse({ response })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error.message })
    }
  }

  public async destroy(contract: HttpContextContract) {
    const { response } = contract;
    try {
      await BookingRecordClientService.delete(contract)
      return SuccessResponse({ response, msg: 'Cancel booking successfully', })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error.message })
    }
  }
}
