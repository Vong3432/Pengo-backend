import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LocationService } from 'App/Services/location/LocationService'
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'

export default class LocationsController {

  private readonly locactionService: LocationService = new LocationService();

  public async index({ response }: HttpContextContract) {
    try {
      return SuccessResponse({ response, data: await this.locactionService.getAllLocations() })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const location = await this.locactionService.createLocation(contract);
      return SuccessResponse({ response, data: location })
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

  public async savePengooLocation({ }: HttpContextContract) {
  }

  public async savePengerLocation({ }: HttpContextContract) {
  }
}
