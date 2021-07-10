import Bouncer, { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import BookingItem from 'App/Models/BookingItem'
import { Roles } from 'App/Models/Role';

export default class BookingItemPolicy extends BasePolicy {
	public async create(user: User) {
		// return 
	}
	public async update(user: User, bookingItem: BookingItem) {
		//
	}
	public async delete(user: User, bookingItem: BookingItem) {}
}
