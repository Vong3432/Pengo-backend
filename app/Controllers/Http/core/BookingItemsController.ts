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
    const { response } = contract;
    try {
      const bookingItem = await BookingItemClientService.findById(contract)
      return SuccessResponse({
        response, data: bookingItem.serialize({
          relations: {
            category: {
              relations: {
                created_by: {
                  fields: {
                    pick: ["id", "name", "logo", "location"],
                    omit: ["created_at", "updated_at"]
                  }
                }
              }
            },
          }
        })
      })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

}
