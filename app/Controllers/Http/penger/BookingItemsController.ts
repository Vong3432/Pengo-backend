import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookingItemService from 'App/Services/booking/BookingItemService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';

export default class BookingItemsController {


  public async index(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const bookingItems = await BookingItemService.findAllByPenger(contract);
      return SuccessResponse({ response, data: bookingItems })
    }
    catch (error) {
      return ErrorResponse({ response, msg: error })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const bookingItem = await BookingItemService.create(contract);
      return SuccessResponse({ response, msg: 'Added successfully', data: bookingItem })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async show(contract: HttpContextContract) {
    const { response, request } = contract;
    try {
      const id = request.param('id')
      const bookingItem = await BookingItemService.findById(id);
      return SuccessResponse({
        response, data: bookingItem.serialize({
          relations: {
            priority_option: {
              fields: {
                omit: ["created_at", "updated_at", "dpo_col_id"]
              },
              relations: {
                dpo_col: {
                  fields: {
                    omit: ["created_at", "updated_at"]
                  },
                  relations: {
                    dpo_table: {
                      fields: {
                        omit: ["created_at", "updated_at"]
                      }
                    }
                  }
                }
              }
            }
          }
        })
      })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async update(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const bookingItem = await BookingItemService.update(contract)
      return SuccessResponse({ response, msg: 'Updated successfully', data: bookingItem })
    } catch (error) {
      return ErrorResponse({ response, msg: error })
    }
  }

  public async destroy(contract: HttpContextContract) {
    const { response } = contract;
    try {
      return SuccessResponse({ response, msg: 'Deleted successfully' })
    } catch (error) {
      return ErrorResponse({ response, msg: error })
    }
  }

  public async getItemsByCategories({ }: HttpContextContract) {
    // TODO: Based on category, filter, and return list of booking items
  }

}
