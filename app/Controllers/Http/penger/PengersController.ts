import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'
import { FounderService } from 'App/Services/users/FounderService';
import { StaffService } from 'App/Services/users/StaffService';
export default class PengersController {

  public async createPenger(contract: HttpContextContract) {
    const { response } = contract;
    try {
      await new FounderService().createPenger(contract);
      return SuccessResponse({ response, msg: "Created Penger!" })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async addStaff(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const staff = await new StaffService().createStaff(contract)
      return SuccessResponse({ response, msg: "New staff created successfully", data: { staff } })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
