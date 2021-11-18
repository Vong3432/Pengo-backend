import { ThrottleConfig } from '@ioc:Adonis/Addons/RequestThrottler'

export default {
	maxAttempts: 50,

	maxAttemptPeriod: 1,

	ttlUnits: 'm',

	cacheStorage: 'redis',

	useOwnCache: true,

	limitExceptionParams: {
		code: 'E_LIMIT_EXCEPTION',
		message: 'Maximum number of attempts exceeded. Please try again later.',
		status: 429,
	},

	requestKeysForRecognizing: ['method', 'hostname', 'url', 'ip'],
} as ThrottleConfig
