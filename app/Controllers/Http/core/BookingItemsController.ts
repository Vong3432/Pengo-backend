import Redis from '@ioc:Adonis/Addons/Redis';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookingItem from 'App/Models/BookingItem'

export default class BookingItemsController {
  public async index({ response }: HttpContextContract) {
    try {

      // if not in cache, get booking items from db.
      const bookingItems = await BookingItem.all().then(item => item);
      return response.status(200).json({ data: bookingItems })
    }
    catch (error) {
      console.log(error)
      return response.status(500).json(error)
    }
  }

  public async show({ response, request }: HttpContextContract) {
    try {
      const bookingItemId = request.params().uniqueId;

      // // check if the item is in the cache
      // const cachedItem = await Redis.get(`booking_item/${bookingItemId}`)
      // if (cachedItem) {
      //   return response.status(200).json(JSON.parse(cachedItem))
      // }

      // item is not in the cache, do query
      const bookingItem = await BookingItem.findByOrFail('uniqueId', bookingItemId)

      // cached the new booking item into redis.
      // await Redis.set(`booking_item/${bookingItemId}`, JSON.stringify(bookingItem), 'EX', 60 * 1)
      return response.status(200).json(bookingItem)
    } catch (error) {
      return response.status(500).json(error)
    }
  }

  public async getItemsByCategories({ }: HttpContextContract) {
    // TODO: Based on category, filter, and return list of booking items
  }

}
