import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookingRecordClientService from 'App/Services/booking/BookingRecordClientService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';

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
      return SuccessResponse({ response, msg: '', data: null })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error.message })
    }
  }
}
