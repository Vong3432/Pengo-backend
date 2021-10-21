import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GooCardService from 'App/Services/goocard/GooCardService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';
import VerifyGooCardValidator from 'App/Validators/pengoo/VerifyGooCardValidator';

export default class GooCardsController {

  public async verifyGooCard({ request, response, auth }: HttpContextContract) {
    try {
      const payload = await request.validate(VerifyGooCardValidator);
      const user = await auth.authenticate()
      await GooCardService.verify(payload.pin, user.id);
      return SuccessResponse({ response, msg: 'Verified' })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async viewCreditPoints({ }: HttpContextContract) {

  }

  public async viewActivityLogs({ }: HttpContextContract) {

  }

  public async update({ }: HttpContextContract) {
  }


}
