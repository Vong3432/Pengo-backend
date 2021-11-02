import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'
import FounderService from 'App/Services/users/FounderService';
import PengerService from 'App/Services/users/PengerService';
export default class PengersController {

  public async index({ response, auth }: HttpContextContract) {
    try {
      const pengers = await PengerService.findAll(auth);
      return SuccessResponse({ response, data: pengers })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async show({ response, auth, request }: HttpContextContract) {
    try {
      const penger = await PengerService.findById(request.param('id'));
      return SuccessResponse({ response, data: penger })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const penger = await FounderService.createPenger(contract);
      return SuccessResponse({ response, msg: "Created Penger!", data: penger })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async update(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const penger = await FounderService.updatePenger(contract);
      return SuccessResponse({ response, msg: "Updated successfully!", data: penger })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async getTotalStaff(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const total = await PengerService.findTotalStaff(contract);
      return SuccessResponse({ response, data: total })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
