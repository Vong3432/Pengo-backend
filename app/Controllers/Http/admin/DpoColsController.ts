import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DpoColService from 'App/Services/admin/DpoColService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'

export default class DpoColsController {
  public async index(contract: HttpContextContract) {
    const { response } = contract;
    try {
      return SuccessResponse({ response, msg: 'Success' })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract;
    try {
      await DpoColService.create(contract);
      return SuccessResponse({ response, msg: 'Column added successfully' })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async show(contract: HttpContextContract) {
    const { response, request } = contract;
    try {
      const dpoCol = await DpoColService.findById(request.param('id'));
      return SuccessResponse({ response, data: dpoCol })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async update(contract: HttpContextContract) {
    const { response } = contract;
    try {
      await DpoColService.update(contract);
      return SuccessResponse({ response, msg: 'Column updated successfully.' })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async destroy(contract: HttpContextContract) {
    const { response } = contract;
    try {
      return SuccessResponse({ response, msg: 'Success' })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
