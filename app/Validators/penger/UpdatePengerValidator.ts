import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from '../MyReporter'

export default class UpdatePengerValidator {
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
		name: schema.string.optional(),
		location_name: schema.string.optional(),
		geolocation: schema.object.optional([
			rules.requiredWhen('location_id', '=', '1')]
		).members({
			latitude: schema.number(),
			longitude: schema.number(),
		}),
		description: schema.string.optional(),
		logo: schema.file.optional({
			extnames: ['png', 'jpg'],
			size: '1mb'
		})
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
		required: 'The {{field}} is required to create penger',
		'logo.size': 'The logo size must be under {{ options.size }}',
		'logo.extname': 'The logo must has one of {{ options.extnames }} extension names',
		'*': (field, rule) => {
			return `${rule} validation error on ${field} for creating penger.`
		},
	}
}
