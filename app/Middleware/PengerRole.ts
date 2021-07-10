import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnAuthorizedException from 'App/Exceptions/UnAuthorizedException';
import { Roles } from 'App/Models/Role';


export default class PengerRole {
  public async handle ({auth, response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const user = auth.user;

    if(!user) 
      return response.unauthorized({error: 'Must be logged in.'})

    if(user.role.name !== Roles.Staff 
      && user.role.name !== Roles.Founder)
      throw UnAuthorizedException; 
      
    await next()
  }
}
