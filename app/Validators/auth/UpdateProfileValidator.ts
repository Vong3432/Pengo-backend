import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from '../MyReporter'

export default class UpdateProfileValidator {
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
		email: schema.string.optional({}, [
			rules.unique({
				table: 'users', column: 'email',
			})
		]),
		username: schema.string.optional(),
		password: schema.string.optional({}, [
			rules.confirmed(),
			rules.minLength(8),
		]),
		phone: schema.string.optional({}, [
			rules.mobile({
				strict: true,
				locales: ["ms-MY"],
			}),
			rules.unique({
				table: "users",
				column: "phone",
			}),
		]),
		avatar: schema.file.optional({
			size: "1mb",
			extnames: ["jpg", "png"],
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
		required: 'The {{field}} is required to update profile',
		'email.unique': "Email already exist, please try another",
		'phone.unique': "Phone already exist, please try another",
		'*': (field, rule) => {
			return `${rule} validation error on ${field} for updating profile.`
		},
	}
}
