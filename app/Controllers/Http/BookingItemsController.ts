import Redis from '@ioc:Adonis/Addons/Redis';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnAuthorizedPengerException from 'App/Exceptions/UnAuthorizedPengerException';
import BookingItem from 'App/Models/BookingItem'
import UpdateBookingItemValidator from 'App/Validators/UpdateBookingItemValidator';

export default class BookingItemsController {
  public async index ({response}: HttpContextContract) {
    try {
      const cachedItems = await Redis.get('booking_items');
      if(cachedItems) {
        return response.status(200).json(JSON.parse(cachedItems))
      }
      const bookingItems = await BookingItem.all().then(item => item);
      await Redis.set('booking_items', JSON.stringify(bookingItems), 'EX', 60 * 5)
      return response.status(200).json(bookingItems)
    } 
    catch(error) {
      return response.status(500).json(error)
    }
  }

  public async create ({}: HttpContextContract) {
  }

  public async show ({response, request}: HttpContextContract) {
    try {
      const bookingItemId = request.params().uniqueId;
      const cachedItem = await Redis.get(`booking_item/${bookingItemId}`)
      if(cachedItem) {
        return response.status(200).json(JSON.parse(cachedItem))
      }
      const bookingItem = await BookingItem.findByOrFail('uniqueId', bookingItemId)
      await Redis.set(`booking_item/${bookingItemId}`, JSON.stringify(bookingItem), 'EX', 60 * 1)
      return response.status(200).json(bookingItem)
    } catch (error) {
      return response.status(500).json(error)
    }
  }

  public async update ({response, request, bouncer}: HttpContextContract) {
    try {
      const bookingItemId = request.params().uniqueId;
      const payload = await request.validate(UpdateBookingItemValidator);
      const bookingItem = await BookingItem.findByOrFail('uniqueId', bookingItemId)
      const penger = bookingItem.category.createdBy

      if(await bouncer.with('UserPolicy').denies('canPerformActionOnPenger', penger)) {
        throw new UnAuthorizedPengerException('You are not authorized to this Penger', 403, 'E_UNAUTHORIZED')
      }

      await bookingItem.merge({...payload}).save();
      await Redis.set(`booking_item/${bookingItemId}`, JSON.stringify(bookingItem), 'EX', 60 * 1)
      return response.status(200).json({msg: 'Updated successfully', item: bookingItem})
    } catch (error) {
      return response.json(error)
    }
  }

  public async destroy ({}: HttpContextContract) {
  }
}
