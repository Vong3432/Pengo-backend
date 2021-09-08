import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookingCategoryService from 'App/Services/booking/BookingCategoryService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';

export default class BookingCategoriesController {

  public async index(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const categories = await BookingCategoryService.findAll(contract);
      return SuccessResponse({ response, data: categories })
    } catch (error) {
      return ErrorResponse({ response, msg: error })
    }
  }

  public async show(contract: HttpContextContract) {
    const { response, request } = contract;
    try {
      const id = request.param('id')
      const category = await BookingCategoryService.findById(id)
      return SuccessResponse({ response, data: category })
    } catch (error) {
      return ErrorResponse({ response, msg: error })
    }
  }
}
