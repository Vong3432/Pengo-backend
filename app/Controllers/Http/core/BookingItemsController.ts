import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookingItemClientService from 'App/Services/booking/BookingItemClientService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';

export default class BookingItemsController {

  public async index(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const bookingItems = await BookingItemClientService.findAll(contract);
      return SuccessResponse({ response, data: bookingItems, code: 200 })
    }
    catch (error) {
      return ErrorResponse({ response, msg: error, code: 500 })
    }
  }

  public async show(contract: HttpContextContract) {
    const { response, request } = contract;
    try {
      const id = request.param('id');
      const bookingItem = await BookingItemClientService.findById(id)
      return SuccessResponse({ response, data: bookingItem })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

}
