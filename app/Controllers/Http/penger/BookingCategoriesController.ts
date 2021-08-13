import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { BookingCategoryService } from 'App/Services/booking/BookingCategoryService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'

export default class BookingCategoriesController {

  private readonly bookingCategoryService: BookingCategoryService;

  constructor() {
    this.bookingCategoryService = new BookingCategoryService();
  }

  public async index(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const bookingCategories = await this.bookingCategoryService.findAllByPenger(contract);
      return SuccessResponse({ response, data: bookingCategories })
    } catch (error) {
      return ErrorResponse({ response, msg: error })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract;
    // Create category
    try {
      const bookingCategory = await this.bookingCategoryService.create(contract);
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
      const bookingCategory = await this.bookingCategoryService.findByIdAndPenger(contract);
      return SuccessResponse({ response, data: bookingCategory })
    } catch (error) {
      return ErrorResponse({ response, msg: error })
    }
  }

  public async update(contract: HttpContextContract) {
    const { response } = contract;
    // Update category
    try {
      const bookingCategory = await this.bookingCategoryService.update(contract)
      return SuccessResponse({ response, data: bookingCategory, msg: "Updated successfully" })
    } catch (error) {
      return ErrorResponse({ response, msg: error })
    }
  }

  public async destroy({ }: HttpContextContract) {
    // Remove category
  }

}
