import Factory from '@ioc:Adonis/Lucid/Factory'
import Setting from 'App/Models/Setting';
import { string } from '@ioc:Adonis/Core/Helpers'

export const SettingFactory = Factory
	.define(Setting, ({ faker }) => {
		return {
			name: faker.random.word(),
			key: string.snakeCase(faker.unique(faker.random.word)),
			value: faker.random.word(),
			isActive: 1
		}
	})
	.build()
