import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from '../MyReporter'

export default class UpdateSystemFunctionValidator {
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
		description: schema.string.optional(),
		is_premium: schema.number.optional([
			rules.unsigned(),
			rules.range(0, 1)
		]),
		is_active: schema.number.optional([
			rules.unsigned(),
			rules.range(0, 1)
		]),
		price: schema.number.optional([
			rules.requiredWhen('is_premium', '=', 1)
		])
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
		required: 'The {{field}} is required to update system function',
		'price.requiredWhen': 'Price cannot be empty since it is premium',
		'*': (field, rule) => {
			return `${rule} validation error on ${field} for updating system function.`
		},
	}
}
