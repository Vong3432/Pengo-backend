import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    // real-time checking for registration
    Route.post('/check-phone', 'AuthController.checkPhone');
    Route.post('/check-email', 'AuthController.checkEmail');

    Route.post('/register', 'AuthController.register')
    Route.post('/login', 'AuthController.login')

    Route.post('/register', 'AuthController.registerAsPengerFounder').prefix('penger')
    Route.post('/login', 'AuthController.loginPenger').prefix('penger')

    Route.post('/login', 'AuthController.loginAdmin').prefix('admin')
}).namespace('App/Controllers/Http/auth').prefix('auth')
