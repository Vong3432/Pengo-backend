import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from '../MyReporter'

export default class CreateCouponValidator {
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
		penger_id: schema.string(),
		title: schema.string(),
		description: schema.string.optional(),
		min_credit_points: schema.number([
			rules.range(0, 5000)
		]),
		required_credit_points: schema.number.optional([
			rules.range(0, 5000)
		]),
		valid_from: schema.date({ format: 'yyyy-MM-dd HH:mm:ss' }, [rules.after('today')]),
		valid_to: schema.date.optional({ format: 'yyyy-MM-dd HH:mm:ss' }, [rules.after('today')]),
		quantity: schema.number([rules.unsigned()]),
		is_redeemable: schema.boolean.optional(),
		is_scannable: schema.boolean.optional(),
		is_selectable: schema.boolean.optional(),
		discount_percentage: schema.number(),
		only_to_items: schema.array.optional().members(
			schema.number([
				rules.exists({ table: 'booking_items', column: 'id' })
			])),
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
		'valid_from.after': 'Start at date is not valid, should be after current time.',
		'min_credit_points.range': 'Min. credit points should range between 0-5000.',
		'required_credit_points.range': 'Required credit points should range between 0-5000.',
		'only_to_items.array': 'Invalid items',
	}
}
