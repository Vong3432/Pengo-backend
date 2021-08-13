import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.post('/register', 'AuthController.register')
    Route.post('/login', 'AuthController.login')

    Route.post('/register', 'AuthController.registerAsPengerFounder').prefix('penger')
    Route.post('/login', 'AuthController.loginPenger').prefix('penger')
}).namespace('App/Controllers/Http/auth').prefix('auth')
