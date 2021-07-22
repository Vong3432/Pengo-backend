import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnAuthorizedPengerException from 'App/Exceptions/UnAuthorizedPengerException';
import Penger from 'App/Models/Penger';
import { PengerVerifyAuthorizationService } from 'App/Services/PengerVerifyAuthorizationService';
import { ErrorResponse } from 'App/Services/ResponseService'
import CreateBookingCategoryValidator from 'App/Validators/penger/CreateBookingCategoryValidator';

export default class BookingCategoriesController {
  public async index({ }: HttpContextContract) {
    // Get all categories of all pengers
  }

  public async getCategoriesByPenger({ }: HttpContextContract) {
    // Get all categories of a penger
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    // Create category
    try {
      const payload = await request.validate(CreateBookingCategoryValidator);
      const penger = await Penger.findByOrFail('id', payload.penger_id);

      await PengerVerifyAuthorizationService.isPenger(bouncer);
      await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

    } catch (error) {
      return ErrorResponse({ response, msg: error })
    }
  }

  public async show({ }: HttpContextContract) {
    // Show category
  }

  public async update({ }: HttpContextContract) {
    // Update category
  }

  public async destroy({ }: HttpContextContract) {
    // Remove category
  }

}
