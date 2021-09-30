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
      return SuccessResponse({response, data: sysFunction})
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
      return SuccessResponse({response, data: sysFunction})
    } catch (error) {
      return ErrorResponse({response, msg: error.messages || error})
    }
  }

  public async destroy (contract: HttpContextContract) {
    const { response } = contract
    try {
      return SuccessResponse({response, data: await SystemFunctionService.delete(contract)})
    } catch (error) {
      return ErrorResponse({response, msg: error.messages || error})
    }
  }
}
