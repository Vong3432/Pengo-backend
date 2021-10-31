import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'
import PengooService from 'App/Services/users/PengooService'

export default class LocationsController {
  public async index(contract: HttpContextContract) {
    const { response } = contract
    try {
      const locations = await PengooService.getLocations(contract);
      return SuccessResponse({ response, data: locations })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract
    try {
      await PengooService.setLocation(contract);
      return SuccessResponse({ response, msg: 'Save successfully' })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async show({ }: HttpContextContract) {
  }

  public async update(contract: HttpContextContract) {
    const { response, request } = contract
    try {
      const { mark_all_not_fav } = request.qs()

      if (mark_all_not_fav == 1)
        await PengooService.markAllAsNotFav(contract);

      return SuccessResponse({ response, msg: 'Update successfully' })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async destroy({ }: HttpContextContract) {
  }
}
