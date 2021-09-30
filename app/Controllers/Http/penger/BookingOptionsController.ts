import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookingOptionService from 'App/Services/booking/BookingOptionService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'

export default class BookingOptionsController {
  public async index (contract: HttpContextContract) {
    const { response } = contract;
    try {
      return SuccessResponse({response, data: await BookingOptionService.findAll(contract)})
    } catch (error) {
      return ErrorResponse({response, msg: error.messages || error})
    }
  }

  public async store (contract: HttpContextContract) {
    const { response } = contract;
    try {
      return SuccessResponse({response, data: await BookingOptionService.create(contract)})
    } catch (error) {
      return ErrorResponse({response, msg: error.messages || error})
    }
  }

  public async show (contract: HttpContextContract) {
    const { response, request } = contract;
    try {
      return SuccessResponse({response, data: await BookingOptionService.findById(request.param('id'))})
    } catch (error) {
      return ErrorResponse({response, msg: error.messages || error})
    }
  }

  public async update (contract: HttpContextContract) {
    const { response } = contract;
    try {
      return SuccessResponse({response, data: await BookingOptionService.update(contract)})
    } catch (error) {
      return ErrorResponse({response, msg: error.messages || error})
    }
  }

  public async destroy (contract: HttpContextContract) {
    const { response } = contract;
    try {
      await BookingOptionService.delete(contract);
      return SuccessResponse({response})
    } catch (error) {
      return ErrorResponse({response, msg: error.messages || error})
    }
  }
}
