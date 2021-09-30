import Factory from '@ioc:Adonis/Lucid/Factory'
import SystemFunction from 'App/Models/SystemFunction';

export const SystemFunctionFactory = Factory
	.define(SystemFunction, ({ faker }) => {
		return {
			name: faker.random.word(),
            description: faker.lorem.paragraph(),
            isPremium: 0,
            price: 0,
            isActive: 1
		}
	})
	.build()
