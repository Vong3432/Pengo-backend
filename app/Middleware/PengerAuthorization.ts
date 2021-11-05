import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Penger from 'App/Models/Penger';
import { PengerVerifyAuthorizationService } from 'App/Services/PengerVerifyAuthorizationService';

export default class PengerAuthorization {
  public async handle({ request, bouncer }: HttpContextContract, next: () => Promise<void>) {

    const { penger_id } = request.qs()

    const penger = await Penger.query()
      .where('id', penger_id)
      .firstOrFail()
    await PengerVerifyAuthorizationService.isPenger(bouncer);
    await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
