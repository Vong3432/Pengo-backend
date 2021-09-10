import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnAuthorizedException from 'App/Exceptions/UnAuthorizedException';
import { Roles } from 'App/Models/Role';

export default class AdminOnly {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const user = await auth.authenticate();

    await user.load('role');

    if (user.role.name !== Roles.Admin)
      throw new UnAuthorizedException("");

    await next()
  }
}
