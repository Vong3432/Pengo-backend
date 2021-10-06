import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    // booking items
    Route.resource('booking-items', 'BookingItemsController').apiOnly()

    // booking options
    Route.resource('booking-options', 'BookingOptionsController').apiOnly()

    // coupons
    Route.resource('coupons', 'CouponsController').apiOnly()

    // booking categories
    Route.resource('booking-categories', 'BookingCategoriesController').apiOnly()

    // pengers
    Route.post('/create', 'PengersController.createPenger').as('penger')
    Route.put('/update/:id', 'PengersController.updatePenger').as('updatePenger')

    // staff
    Route.group(() => {
        Route.post('/create', 'PengersController.addStaff').as('staff')
    }).prefix('staff')

    // system functions
    Route.get('/system-functions', 'SystemFunctionsController.index')
        .namespace('App/Controllers/Http/admin')
        .as('getSystemFunctions')

})
    .namespace('App/Controllers/Http/penger')
    .prefix('/penger')
    .as('penger')
    .middleware(['auth', 'penger_role'])