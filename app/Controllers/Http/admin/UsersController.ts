import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserService from 'App/Services/admin/UserService'
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'

export default class UsersController {
  public async index(contract: HttpContextContract) {
    const { response } = contract
    try {
      const users = await UserService.findAll(contract)
      return SuccessResponse({ response, data: users })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }

  }

  public async store(contract: HttpContextContract) {
    const { response } = contract
    try {
      return SuccessResponse({ response })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async show(contract: HttpContextContract) {
    const { response, request } = contract
    try {
      const user = await UserService.findById(request.param('id'))
      return SuccessResponse({ response, data: user })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async update(contract: HttpContextContract) {
    const { response } = contract
    try {
      const updatedUser = await UserService.update(contract)
      return SuccessResponse({ response, msg: `Updated user status successfully`, data: updatedUser })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async destroy(contract: HttpContextContract) {
    const { response } = contract
    try {
      return SuccessResponse({ response })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
