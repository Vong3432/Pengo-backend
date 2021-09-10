import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';

export default class SettingsController {
  public async index(contract: HttpContextContract) {
    const { response } = contract;
    try {
      return SuccessResponse({ response, msg: 'Success' });
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
    return 'settings'
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract;
    try {
      return SuccessResponse({ response, msg: 'Success' });
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async show(contract: HttpContextContract) {
    const { response } = contract;
    try {
      return SuccessResponse({ response, msg: 'Success' });
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async update(contract: HttpContextContract) {
    const { response } = contract;
    try {
      return SuccessResponse({ response, msg: 'Success' });
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async destroy(contract: HttpContextContract) {
    const { response } = contract;
    try {
      return SuccessResponse({ response, msg: 'Success' });
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
