import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookingCloseDateService from 'App/Services/booking_close_dates/BookingCloseDateService'
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'

export default class BookingCloseDatesController {
  public async index(contract: HttpContextContract) {
    const { response } = contract
    try {
      const dates = await BookingCloseDateService.findAll(contract)
      return SuccessResponse({ response, data: dates })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract
    try {
      await BookingCloseDateService.create(contract)
      return SuccessResponse({ response, msg: "Add successfully" })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async show(contract: HttpContextContract) {
    const { response, request } = contract
    try {
      const date = await BookingCloseDateService.findById(request.param('id'), contract)
      return SuccessResponse({ response, data: date })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async update(contract: HttpContextContract) {
    const { response } = contract
    try {
      await BookingCloseDateService.update(contract);
      return SuccessResponse({ response, msg: "Update successfully" })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async destroy(contract: HttpContextContract) {
    const { response } = contract
    try {
      await BookingCloseDateService.delete(contract);
      return SuccessResponse({ response, msg: "Remove successfully" })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
