import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnAuthorizedException from 'App/Exceptions/UnAuthorizedException';
import { Roles } from 'App/Models/Role';

export default class PengooRole {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const user = auth.user;

    if (!user)
      return response.unauthorized({ msg: 'Must be logged in.' })

    if (user.isBanned === 1)
      return response.unauthorized({ msg: 'You account has been suspended. For any issue kindly email to admin.' })

    await user.load('role');

    if (user.role.name !== Roles.Pengoo)
      throw new UnAuthorizedException('You are not allowed', 403, 'NotAllowed');

    await next()
  }
}
