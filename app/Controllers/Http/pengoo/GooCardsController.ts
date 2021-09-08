import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GooCardService from 'App/Services/goocard/GooCardService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';
import VerifyGooCardValidator from 'App/Validators/pengoo/VerifyGooCardValidator';

export default class GooCardsController {

  public async store({ }: HttpContextContract) {
  }

  public async verifyGooCard({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(VerifyGooCardValidator);
      await GooCardService.verify(payload.pin, payload.user_id);
      return SuccessResponse({ response, msg: 'Verified' })
    } catch (error) {
      return ErrorResponse({ response, msg: error })
    }
  }

  public async viewCreditPoints({ }: HttpContextContract) {

  }

  public async viewActivityLogs({ }: HttpContextContract) {

  }

  public async update({ }: HttpContextContract) {
  }


}
