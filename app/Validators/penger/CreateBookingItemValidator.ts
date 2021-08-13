import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateBookingItemValidator {
	constructor(protected ctx: HttpContextContract) {
	}

	/*
	 * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
	 *
	 * For example:
	 * 1. The username must be of data type string. But then also, it should
	 *    not contain special characters or numbers.
	 *    ```
	 *     schema.string({}, [ rules.alpha() ])
	 *    ```
	 *
	 * 2. The email must be of data type string, formatted as a valid
	 *    email. But also, not used by any other user.
	 *    ```
	 *     schema.string({}, [
	 *       rules.email(),
	 *       rules.unique({ table: 'users', column: 'email' }),
	 *     ])
	 *    ```
	 */
	public schema = schema.create({
		penger_id: schema.string(),
		poster: schema.file({ size: '5mb', extnames: ['jpg', 'png'] }),
		sub_images: schema.array.optional().members(
			schema.file({
				size: '5mb', extnames: ['jpg', 'png']
			})
		),
		priority_option_id: schema.number.optional([rules.requiredWhen('is_preservable', '=', '1')]),
		geolocation: schema.object().members({
			latitude: schema.number(),
			longitude: schema.number(),
		}),
		parent_booking_item: schema.number.optional(),
		booking_category_id: schema.number(),
		name: schema.string(),
		description: schema.string.optional(),
		maximum_book: schema.number.optional(),
		maximum_transfer: schema.number.optional([
			rules.requiredWhen('is_transferable', '=', '1')
		]),
		preserved_book: schema.number.optional([
			rules.requiredWhen('is_preservable', '=', '1')
		]),
		credit_points: schema.number.optional(),
		is_preservable: schema.number.optional(),
		is_active: schema.number.optional(),
		is_transferable: schema.number.optional(),
		is_countable: schema.number.optional(),
		is_discountable: schema.number.optional(),
		quantity: schema.number.optional([
			rules.requiredWhen('is_countable', '=', '1')
		]),
		price: schema.number.optional([
			rules.requiredWhen('is_discountable', '=', '1')
		]),
		discount_amount: schema.number.optional([
			rules.requiredWhen('is_discountable', '=', '1')
		]),
		available_from_time: schema.date.optional({ format: 'HH:mm' }, [rules.requiredIfNotExistsAny(['start_from', 'end_at'])]),
		available_to_time: schema.date.optional({ format: 'HH:mm' }, [rules.requiredIfNotExistsAny(['start_from', 'end_at'])]),
		start_from: schema.date.optional({ format: 'yyyy-MM-dd HH:mm:ss' }, []),
		end_at: schema.date.optional({ format: 'yyyy-MM-dd HH:mm:ss' }, []),
	})

	/**
	 * Custom messages for validation failures. You can make use of dot notation `(.)`
	 * for targeting nested fields and array expressions `(*)` for targeting all
	 * children of an array. For example:
	 *
	 * {
	 *   'profile.username.required': 'Username is required',
	 *   'scores.*.number': 'Define scores as valid numbers'
	 * }
	 *
	 */
	public messages = {
		required: 'The {{field}} is required to create item',
		'*': (field, rule) => {
			return `${rule} validation error on ${field} for creating booking item.`
		},
	}
}
