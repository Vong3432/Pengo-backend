import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnAuthorizedException from 'App/Exceptions/UnAuthorizedException';
import { Roles } from 'App/Models/Role';


export default class PengerRole {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const user = auth.user;

    if (!user)
      return response.unauthorized({ error: 'Must be logged in.' })

    await user.load('role');

    if (user.role.name !== Roles.Staff
      && user.role.name !== Roles.Founder)
      throw new UnAuthorizedException('You are not allowed', 403, 'NotAllowed');

    await next()
  }
}
