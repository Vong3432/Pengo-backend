import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BookingCategoriesController {
  public async index ({}: HttpContextContract) {
    // Get all categories of all pengers
  }

  public async getCategoriesByPenger ({}: HttpContextContract) {
    // Get all categories of a penger
  }

}
