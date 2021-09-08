import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookingCategoryService from 'App/Services/booking/BookingCategoryService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'

export default class BookingCategoriesController {

  public async index(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const bookingCategories = await BookingCategoryService.findAllByPenger(contract);
      return SuccessResponse({ response, data: bookingCategories })
    } catch (error) {
      return ErrorResponse({ response, msg: error })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract;
    // Create category
    try {
      const bookingCategory = await BookingCategoryService.create(contract);
      return SuccessResponse({ response, data: bookingCategory })
    } catch (error) {
      return ErrorResponse({ response, msg: error })
    }
  }

  public async show(contract: HttpContextContract) {
    const { response } = contract;
    // Show category
    try {
      // get
      const bookingCategory = await BookingCategoryService.findByIdAndPenger(contract);
      return SuccessResponse({ response, data: bookingCategory })
    } catch (error) {
      return ErrorResponse({ response, msg: error })
    }
  }

  public async update(contract: HttpContextContract) {
    const { response } = contract;
    // Update category
    try {
      const bookingCategory = await BookingCategoryService.update(contract)
      return SuccessResponse({ response, data: bookingCategory, msg: "Updated successfully" })
    } catch (error) {
      return ErrorResponse({ response, msg: error })
    }
  }

  public async destroy({ }: HttpContextContract) {
    // Remove category
  }

}
