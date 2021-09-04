import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { BookingItemService } from 'App/Services/booking/BookingItemService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';

export default class BookingItemsController {

  private readonly bookingItemService: BookingItemService;

  constructor() {
    this.bookingItemService = new BookingItemService();
  }

  public async index(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const bookingItems = await this.bookingItemService.findAllByPenger(contract);
      return SuccessResponse({ response, data: bookingItems })
    }
    catch (error) {
      console.log(error.messages)
      return ErrorResponse({ response, msg: error })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const bookingItem = await this.bookingItemService.create(contract);
      return SuccessResponse({ response, msg: 'Added successfully', data: bookingItem })
    } catch (error) {
      console.log("errmsg", error.messages)
      return ErrorResponse({ response, msg: error })
    }
  }

  public async show(contract: HttpContextContract) {
    const { response, request } = contract;
    try {
      const id = request.param('id')
      const bookingItem = await this.bookingItemService.findById(id);
      return SuccessResponse({ response, data: bookingItem })
    } catch (error) {
      console.log(error)
      console.log(error.messages)
      return ErrorResponse({ response, msg: error })
    }
  }

  public async update(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const bookingItem = await this.bookingItemService.update(contract)
      return SuccessResponse({ response, msg: 'Updated successfully', data: bookingItem })
    } catch (error) {
      console.log(error.messages)
      return ErrorResponse({ response, msg: error })
    }
  }

  public async destroy(contract: HttpContextContract) {
    const { response } = contract;
    try {
      return SuccessResponse({ response, msg: 'Deleted successfully' })
    } catch (error) {
      console.log(error.messages)
      return ErrorResponse({ response, msg: error })
    }
  }

  public async getItemsByCategories({ }: HttpContextContract) {
    // TODO: Based on category, filter, and return list of booking items
  }

}
