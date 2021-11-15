import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Setting from 'App/Models/Setting';
import SettingService from 'App/Services/admin/SettingService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';

export default class SettingsController {
  public async index(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const settings = await SettingService.findAll(contract)
      return SuccessResponse({ response, data: settings });
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const setting = await SettingService.create(contract)
      return SuccessResponse({ response, msg: 'Created successfully', data: setting });
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async show(contract: HttpContextContract) {
    const { response, request } = contract;
    try {
      let setting: Setting | null = null;

      if (request.param('id'))
        setting = await SettingService.findById(request.param('id'))
      else if (request.qs().key)
        setting = await SettingService.findByKey(request.qs().key)

      return SuccessResponse({ response, data: setting });
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async update(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const setting = await SettingService.update(contract)
      return SuccessResponse({ response, msg: 'Updated successfully', data: setting });
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async destroy(contract: HttpContextContract) {
    const { response } = contract;
    try {
      await SettingService.delete(contract);
      return SuccessResponse({ response, msg: 'Deleted successfully' });
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
