import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateBookingItemValidator {
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
		penger_id: schema.number(),
		priority_option_id: schema.number.optional([rules.requiredWhen('is_preservable', '=', '1')]),
		geolocation: schema.object.optional([
			rules.requiredWhen('location_id', '=', '1')]
		).members({
			latitude: schema.number(),
			longitude: schema.number(),
		}),
		booking_category_id: schema.string.optional(),
		name: schema.string.optional(),
		poster: schema.file.optional({ size: '5mb', extnames: ['jpg', 'png'] }),
		sub_images: schema.array.optional().members(
			schema.file({
				size: '5mb', extnames: ['jpg', 'png']
			})
		),
		description: schema.string.optional(),
		maximum_book: schema.number.optional([
			rules.unsigned()
		]),
		maximum_transfer: schema.number.optional([
			rules.requiredWhen('is_transferable', '=', '1'),
			rules.unsigned()
		]),
		preserved_book: schema.number.optional([
			rules.requiredWhen('is_preservable', '=', '1'),
			rules.unsigned()
		]),
		credit_points: schema.number.optional([
			rules.unsigned()
		]),
		is_preservable: schema.number.optional(),
		is_active: schema.number.optional(),
		is_transferable: schema.number.optional(),
		is_countable: schema.number.optional(),
		is_discountable: schema.number.optional(),
		quantity: schema.number.optional([
			rules.requiredWhen('is_countable', '=', '1'),
			rules.unsigned()
		]),
		price: schema.number.optional([
			rules.requiredWhen('is_discountable', '=', '1'),
			rules.unsigned()
		]),
		discount_amount: schema.number.optional([
			rules.requiredWhen('is_discountable', '=', '1'),
			rules.unsigned()
		]),
		available_from_time: schema.date.optional({ format: 'HH:mm' }, [rules.after('today')]),
		available_to_time: schema.date.optional({ format: 'HH:mm' }, [rules.after('today')]),
		start_from: schema.date.optional({ format: 'yyyy-MM-dd HH:mm:ss' }, [rules.after('today')]),
		end_at: schema.date.optional({ format: 'yyyy-MM-dd HH:mm:ss' }, [rules.after('today')]),
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
		'*': (field, rule) => {
			return `${rule} validation error on ${field} for updating booking item.›`
		},
	}
}
