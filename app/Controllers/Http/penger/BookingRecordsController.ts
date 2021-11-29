import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookingRecord from 'App/Models/BookingRecord';
import BookingItemService from 'App/Services/booking/BookingItemService';
import BookingRecordService from 'App/Services/booking/BookingRecordService'
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'
import { DateTime } from 'luxon/src/datetime';

export default class BookingRecordsController {

  public async getTotalBookingToday(contract: HttpContextContract) {
    const { response } = contract
    try {
      const total = await BookingRecordService.getTodayRecordsStat(contract);
      return SuccessResponse({ response, data: total })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async index(contract: HttpContextContract) {
    const { response } = contract
    try {
      const records = await BookingRecordService.findAll(contract);
      return SuccessResponse({ response, data: records })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async store({ }: HttpContextContract) {
  }

  public async show(contract: HttpContextContract) {
    const { response, request } = contract
    try {
      const record = await BookingRecordService.findById(request.param('id'), contract);
      return SuccessResponse({ response, data: record })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  // public async getItemRecords(contract: HttpContextContract) {
  //   const { response } = contract
  //   try {
  //     const record = await BookingItemService.viewItemRecords(contract);
  //     return SuccessResponse({ response, data: record })
  //   } catch (error) {
  //     return ErrorResponse({ response, msg: error.messages || error })
  //   }
  // }

  public async update(contract: HttpContextContract) {
    const { response } = contract
    try {
      await BookingRecordService.update(contract);
      return SuccessResponse({ response, msg: 'Verified successfully' })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async destroy({ }: HttpContextContract) {
  }
}
