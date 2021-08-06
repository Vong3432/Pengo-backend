import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'
import { FounderService } from 'App/Services/users/FounderService';
import { StaffService } from 'App/Services/users/StaffService';
export default class PengersController {

  public async createPenger({ request, response, auth, bouncer }: HttpContextContract) {
    try {
      await new FounderService().createPenger(request, auth, bouncer);
      return SuccessResponse({ response, msg: "Created Penger!" })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async addStaff({ request, response, bouncer }: HttpContextContract) {
    try {
      const staff = await new StaffService().createStaff(request, bouncer)
      return SuccessResponse({ response, msg: "New staff created successfully", data: { staff } })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
