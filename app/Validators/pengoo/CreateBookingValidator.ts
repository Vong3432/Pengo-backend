import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from '../MyReporter'

export default class CreateBookingValidator {
	constructor(protected ctx: HttpContextContract) {
	}

	public reporter = MyReporter
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
		pin: schema.string({}, [
			rules.minLength(6),
			rules.maxLength(6)
		]),
		booking_item_id: schema.number(),
		penger_id: schema.number(),
		book_time: schema.string.optional(),
		book_date: schema.object.optional().members({
			start_date: schema.date.optional({ format: 'yyyy-MM-dd' }),
			end_date: schema.date.optional({ format: 'yyyy-MM-dd' }),
		}),
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
