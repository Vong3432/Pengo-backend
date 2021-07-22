import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnAuthorizedPengerException from 'App/Exceptions/UnAuthorizedPengerException';
import BookingCategory from 'App/Models/BookingCategory';
import Penger from 'App/Models/Penger';
import { DBTransactionService } from 'App/Services/DBTransactionService';
import { PengerVerifyAuthorizationService } from 'App/Services/PengerVerifyAuthorizationService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'
import CreateBookingCategoryValidator from 'App/Validators/penger/CreateBookingCategoryValidator';

export default class BookingCategoriesController {
  public async index({ request, bouncer, response }: HttpContextContract) {
    // Get all categories of a penger
    try {
      const pengerId = request.qs().penger_id;
      const pageNum = request.qs().page_num || 1;

      if (!pengerId) {
        return ErrorResponse({ response, msg: "Penger id is missing." })
      }

      const penger = await Penger.findByOrFail('id', pengerId);

      // verify
      await PengerVerifyAuthorizationService.isPenger(bouncer);
      await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

      // get
      const bookingCategories = await penger.related('bookingCategories').query().preload('bookingItems').paginate(pageNum);
      return SuccessResponse({ response, data: bookingCategories.toJSON() })
    } catch (error) {
      return ErrorResponse({ response, msg: error })
    }
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    const trx = await DBTransactionService.init();

    // Create category
    try {
      const payload = await request.validate(CreateBookingCategoryValidator);
      const penger = await Penger.findByOrFail('id', payload.penger_id);

      // verify
      await PengerVerifyAuthorizationService.isPenger(bouncer);
      await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

      const bookingCategory = new BookingCategory();
      // set transaction
      bookingCategory.useTransaction(trx);

      // set data
      bookingCategory.fill({ name: payload.name });

      // bind relation
      await penger.related('bookingCategories').save(bookingCategory);

      // commit
      await DBTransactionService.commit(trx);

      return SuccessResponse({ response, data: bookingCategory })

    } catch (error) {
      await DBTransactionService.rollback(trx);
      return ErrorResponse({ response, msg: error })
    }
  }

  public async show({ request, response, bouncer }: HttpContextContract) {
    // Show category
    try {
      const { penger_id: pengerId } = request.qs();
      const categoryId = request.param('id');

      if (!pengerId) {
        return ErrorResponse({ response, msg: "Penger id is missing." })
      }

      const penger = await Penger.findByOrFail('id', pengerId);

      // verify
      await PengerVerifyAuthorizationService.isPenger(bouncer);
      await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

      // get
      const bookingCategory = await BookingCategory.findByOrFail('id', categoryId);

      return SuccessResponse({ response, data: bookingCategory })
    } catch (error) {
      return ErrorResponse({ response, msg: error })
    }
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    // Update category
    const trx = await DBTransactionService.init();
    // Show category
    try {
      const { name, penger_id: pengerId, is_enable } = request.body();
      const categoryId = request.param('id');

      if (!pengerId) {
        return ErrorResponse({ response, msg: "Penger id is missing." })
      }

      const penger = await Penger.findByOrFail('id', pengerId);

      // verify
      await PengerVerifyAuthorizationService.isPenger(bouncer);
      await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

      // get
      const bookingCategory = await BookingCategory.findByOrFail('id', categoryId);

      await bookingCategory.useTransaction(trx).merge({ name, isEnable: is_enable || bookingCategory.isEnable }).save();
      await DBTransactionService.commit(trx)

      return SuccessResponse({ response, data: bookingCategory, msg: "Updated successfully" })
    } catch (error) {
      await DBTransactionService.rollback(trx)
      return ErrorResponse({ response, msg: error })
    }
  }

  public async destroy({ }: HttpContextContract) {
    // Remove category
  }

}
