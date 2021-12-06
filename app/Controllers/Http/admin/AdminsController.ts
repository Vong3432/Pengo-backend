import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdminService from 'App/Services/admin/AdminService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'

export default class AdminsController {
  public async getDBTables(contract: HttpContextContract) {
    const { response, request } = contract;
    try {
      const showDuplicate: number = request.qs().show_duplicate
      const tables = await AdminService.getAllTables({ showDuplicate: showDuplicate == 1 })
      return SuccessResponse({ response, data: tables })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
  public async getDBColumns(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const columns = await AdminService.getAllColumns(contract)
      return SuccessResponse({ response, data: columns })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
