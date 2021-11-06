import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'

export default class TransactionsController {
  public async index(contract: HttpContextContract) {
    const { response } = contract
    try {
      return SuccessResponse({ response })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async create({ }: HttpContextContract) {
  }

  public async store({ }: HttpContextContract) {
  }

  public async show({ }: HttpContextContract) {
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
