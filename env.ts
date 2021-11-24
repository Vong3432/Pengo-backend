/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
    DB_CONNECTION: Env.schema.string(),
    MYSQL_HOST: Env.schema.string({ format: 'host' }),
    MYSQL_PORT: Env.schema.number(),
    MYSQL_USER: Env.schema.string(),
    MYSQL_PASSWORD: Env.schema.string.optional(),
    MYSQL_DB_NAME: Env.schema.string(),
    REDIS_CONNECTION: Env.schema.enum(['local', 'prod'] as const),
    REDIS_HOST: Env.schema.string({ format: 'host' }),
    REDIS_PORT: Env.schema.number(),
    REDIS_PASSWORD: Env.schema.string.optional(),
    MAP_API_KEY: Env.schema.string(),
    STRIPE_PK: Env.schema.string(),
    STRIPE_SK: Env.schema.string(),
    PENGO_ADMIN_SECRET: Env.schema.string(),
    SMTP_USER: Env.schema.string(),
    SMTP_PASS: Env.schema.string(),
    SIMPLEMAIL_ENDPOINT: Env.schema.string(),
})
