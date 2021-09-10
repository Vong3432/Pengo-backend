import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DpoTableService from 'App/Services/admin/DpoTableService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';

export default class DpoTablesController {
  public async index(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const dpoTables = await DpoTableService.findAll(contract);
      return SuccessResponse({ response, data: dpoTables });
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract;
    try {
      await DpoTableService.create(contract);
      return SuccessResponse({ response, msg: 'Add new table successfully' });
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async show(contract: HttpContextContract) {
    const { response, request } = contract;
    try {
      const id = request.param('id');
      const dpoTable = await DpoTableService.findById(id);
      return SuccessResponse({ response, data: dpoTable });
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async update(contract: HttpContextContract) {
    const { response } = contract;
    try {
      await DpoTableService.update(contract);
      return SuccessResponse({ response, msg: 'Updated table successfully' });
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async destroy(contract: HttpContextContract) {
    const { response } = contract;
    try {
      await DpoTableService.delete(contract);
      return SuccessResponse({ response, msg: 'Table remove successfully.' });
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
