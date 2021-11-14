import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FeedbackClientService from 'App/Services/feedback/FeedbackClientService'
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'

export default class FeedbacksController {
  public async index(contract: HttpContextContract) {
    const { response } = contract
    try {
      const feedbacks = await FeedbackClientService.findAll(contract)
      return SuccessResponse({ response, data: feedbacks })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract
    try {
      await FeedbackClientService.create(contract)
      return SuccessResponse({ response, msg: 'Reviewed' })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async show(contract: HttpContextContract) {
    const { response, request } = contract
    try {
      const feedback = await FeedbackClientService.findById(request.param('id'))
      return SuccessResponse({ response, data: feedback })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async update(contract: HttpContextContract) {
    const { response } = contract
    try {
      await FeedbackClientService.update(contract)
      return SuccessResponse({ response, msg: 'Updated review' })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async destroy(contract: HttpContextContract) {
    const { response } = contract
    try {
      await FeedbackClientService.delete(contract)
      return SuccessResponse({ response, msg: 'Removed review' })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
