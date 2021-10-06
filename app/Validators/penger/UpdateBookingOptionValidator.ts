import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from '../MyReporter'

export default class UpdateBookingOptionValidator {
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
		// booking_category_id: schema.number([
		// 	rules.unsigned(),
		// 	rules.exists({ table: 'booking_categories', column: 'id' })
		// ]),
		system_function_ids: schema.array().members(schema.number([
			rules.unsigned(),
			rules.exists({ table: 'system_functions', column: 'id' })
		])),
		is_enable: schema.number.optional([
			rules.unsigned(),
			rules.range(0, 1)
		])
		// system_function_key: schema.string({}, [
		//   rules.exists({table: 'system_functions', column: 'name'})
		// ])
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
		required: 'The {{field}} is required to update booking option',
		'*': (field, rule) => {
			return `${rule} validation error on ${field} for update booking option.`
		},
	}
}
