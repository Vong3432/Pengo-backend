import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { SuccessResponse, ErrorResponse } from 'App/Services/ResponseService';
import { StaffService } from 'App/Services/users/StaffService';

export default class PengerStaffController {
  public async index(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const staffList = await new StaffService().findAll(contract)
      return SuccessResponse({ response, data: staffList })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract;
    try {
      await new StaffService().create(contract)
      return SuccessResponse({ response, msg: "New staff created successfully" })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async show(contract: HttpContextContract) {
    const { response, request } = contract;
    try {
      const staffList = await new StaffService().findById(request.param('id'), contract)
      return SuccessResponse({ response, data: staffList })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
