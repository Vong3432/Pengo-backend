import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'
import PengerService from 'App/Services/users/PengerService'

export default class BalancesController {
  public async index(contract: HttpContextContract) {
    const { response } = contract
    try {
      const info = await PengerService.getBalanceInfo(contract)
      return SuccessResponse({ response, data: info })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract
    try {
      await PengerService.payout(contract)
      return SuccessResponse({ response, msg: 'Withdraw successfully' })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async show({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
