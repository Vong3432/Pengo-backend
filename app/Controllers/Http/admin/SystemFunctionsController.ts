import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SystemFunctionService from 'App/Services/admin/SystemFunctionService'
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'

export default class SystemFunctionsController {
  public async index (contract: HttpContextContract) {
    const { response } = contract
    try {
      return SuccessResponse({response, data: await SystemFunctionService.findAll(contract)})
    } catch (error) {
      return ErrorResponse({response, msg: error.messages || error})
    }
  }

  public async store (contract: HttpContextContract) {
    const { response } = contract
    try {
      const sysFunction = await SystemFunctionService.create(contract);
      return SuccessResponse({response, data: sysFunction, msg: "Add system function successfully."})
    } catch (error) {
      return ErrorResponse({response, msg: error.messages || error})
    }
  }

  public async show (contract: HttpContextContract) {
    const { response, request } = contract
    try {
      return SuccessResponse({response, data: await SystemFunctionService.findById(request.param('id'))})
    } catch (error) {
      return ErrorResponse({response, msg: error.messages || error})
    }
  }

  public async update (contract: HttpContextContract) {
    const { response } = contract
    try {
      const sysFunction = await SystemFunctionService.update(contract);
      return SuccessResponse({response, data: sysFunction, msg: "Updated successfully"})
    } catch (error) {
      return ErrorResponse({response, msg: error.messages || error})
    }
  }

  public async destroy (contract: HttpContextContract) {
    const { response } = contract
    try {
      await SystemFunctionService.delete(contract)
      return SuccessResponse({response, msg: "Deleted successfully"})
    } catch (error) {
      return ErrorResponse({response, msg: error.messages || error})
    }
  }
}
