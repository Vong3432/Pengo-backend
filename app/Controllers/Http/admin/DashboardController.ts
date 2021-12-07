import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DashboardService from 'App/Services/admin/DashboardService'
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'

export default class DashboardController {
  public async getStats(contract: HttpContextContract) {
    const { response } = contract
    try {
      const data = await DashboardService.getStats(contract)
      return SuccessResponse({
        response, data: {
          user_stat: {
            total: data.userStat.total,
            new_pengoo: data.userStat.newPengoo,
            new_penger: data.userStat.newPenger,
          },
        }
      })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async getCommissionAndItemsData(contract: HttpContextContract) {
    const { response } = contract
    try {
      const data = await DashboardService.getCommissionAndItemsData(contract)
      return SuccessResponse({
        response, data: {
          commission_data: data.commissionData,
          commission_stat: data.commissionStat,
          item_stat: data.itemStat,
        }
      })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async getBookingData(contract: HttpContextContract) {
    const { response } = contract
    try {
      const data = await DashboardService.getBookingData(contract)
      return SuccessResponse({
        response, data: {
          booking_data: data.yearlyData,
          rate: data.rate,
        }
      })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
