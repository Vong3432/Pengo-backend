import Redis from '@ioc:Adonis/Addons/Redis';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnAuthorizedPengerException from 'App/Exceptions/UnAuthorizedPengerException';
import BookingCategory from 'App/Models/BookingCategory';
import BookingItem from 'App/Models/BookingItem'
import Penger from 'App/Models/Penger';
import CreateBookingItemValidator from 'App/Validators/CreateBookingItemValidator';
import UpdateBookingItemValidator from 'App/Validators/UpdateBookingItemValidator';

export default class BookingItemsController {
  public async index ({response}: HttpContextContract) {
    try {
      // find booking items in cache
      const cachedItems = await Redis.get('booking_items');
      if(cachedItems) {
        return response.status(200).json(JSON.parse(cachedItems))
      }

      // if not in cache, get booking items from db.
      const bookingItems = await BookingItem.all().then(item => item);

      // save all the booking items into cache
      await Redis.set('booking_items', JSON.stringify(bookingItems), 'EX', 60 * 5)

      return response.status(200).json(bookingItems)
    } 
    catch(error) {
      return response.status(500).json(error)
    }
  }

  public async create ({request, response, bouncer}: HttpContextContract) {
    try {
      const bookingItemId = request.params().uniqueId;

      // validate request body 
      const payload = await request.validate(CreateBookingItemValidator);

      // find category and current penger.
      const bookingCategory = await BookingCategory.findByOrFail('id', payload.booking_category_id);
      const penger = await Penger.findByOrFail('id', payload.penger_id);

      // verify authorization of current user.
      if(await bouncer.with('UserPolicy').denies('canPerformActionOnPenger', penger)) {
        throw new UnAuthorizedPengerException('You are not authorized to this Penger', 403, 'E_UNAUTHORIZED')
      }

      // create a new booking item
      const bookingItem = new BookingItem();
      bookingItem.fill({
        ...payload
      })
      
      // save booking item into category
      await bookingCategory.related('bookingItems').save(bookingItem);

      // cached the new booking item into redis.
      await Redis.set(`booking_item/${bookingItemId}`, JSON.stringify(bookingItem), 'EX', 60 * 1)

      return response.status(200).json({msg: 'Updated successfully', item: bookingItem})
    } catch (error) {
      return response.json(error)
    }
  }

  public async show ({response, request}: HttpContextContract) {
    try {
      const bookingItemId = request.params().uniqueId;

      // check if the item is in the cache
      const cachedItem = await Redis.get(`booking_item/${bookingItemId}`)
      if(cachedItem) {
        return response.status(200).json(JSON.parse(cachedItem))
      }

      // item is not in the cache, do query
      const bookingItem = await BookingItem.findByOrFail('uniqueId', bookingItemId)

      // cached the new booking item into redis.
      await Redis.set(`booking_item/${bookingItemId}`, JSON.stringify(bookingItem), 'EX', 60 * 1)
      return response.status(200).json(bookingItem)
    } catch (error) {
      return response.status(500).json(error)
    }
  }

  public async update ({response, request, bouncer}: HttpContextContract) {
    try {
      const bookingItemId = request.params().uniqueId;

      // validate request body
      const payload = await request.validate(UpdateBookingItemValidator);

      // find booking item
      const bookingItem = await BookingItem.findByOrFail('uniqueId', bookingItemId)
      // get the Penger through relationship
      const penger = bookingItem.category.createdBy

      // verify if current user is authorized.
      if(await bouncer.with('UserPolicy').denies('canPerformActionOnPenger', penger)) {
        throw new UnAuthorizedPengerException('You are not authorized to this Penger', 403, 'E_UNAUTHORIZED')
      }

      // dynamically update fields
      await bookingItem.merge({...payload}).save();

      // set the updated booking item into cache.
      await Redis.set(`booking_item/${bookingItemId}`, JSON.stringify(bookingItem), 'EX', 60 * 1)

      return response.status(200).json({msg: 'Updated successfully', item: bookingItem})
    } catch (error) {
      return response.json(error)
    }
  }

  public async destroy ({}: HttpContextContract) {
  }
}
