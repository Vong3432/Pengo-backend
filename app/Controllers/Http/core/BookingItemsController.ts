import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { BookingItemService } from 'App/Services/booking/BookingItemService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';

export default class BookingItemsController {
  private readonly service: BookingItemService = new BookingItemService();

  public async index(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const bookingItems = await this.service.findAll(contract);
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
      const bookingItem = await this.service.findById(id)
      return response.status(200).json(bookingItem)
    } catch (error) {
      return response.status(500).json(error)
    }
  }

}
