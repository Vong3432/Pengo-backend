import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateBookingItemValidator {
  constructor (protected ctx: HttpContextContract) {
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
	booking_category_id: schema.string(),
	name: schema.string.optional(),
	description: schema.string.optional(),
	maximum_book: schema.number.optional([
	  rules.requiredIfExists('is_countable')
	]),
	maximum_transfer: schema.number.optional([
	  rules.requiredIfExists('is_transferable')
	]),
	preserved_book: schema.boolean.optional([
		rules.requiredIfExists('is_preservable')
	  ]),
	credit_points: schema.number.optional(),
	is_preservable: schema.number.optional(),
	is_active: schema.number.optional(),
	is_transferable: schema.number.optional(),
	is_countable: schema.number.optional(),
	is_discountable: schema.number.optional(),
	quantity: schema.number.optional(),
	price: schema.number.optional(),
	discount_amount: schema.number.optional([
	  rules.requiredIfExists('is_discountable')
	]),
	availabe_from_time: schema.date.optional({format: 'HH:mm'}),
	availabe_to_time: schema.date.optional({format: 'HH:mm'}),
	start_from: schema.date.optional({format: 'yyyy-MM-dd HH:mm:ss'}),
	ended_at: schema.date.optional({format: 'yyyy-MM-dd HH:mm:ss'}),
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
