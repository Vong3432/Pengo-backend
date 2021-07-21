import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    // booking items
    Route.resource('booking-items', 'BookingItemsController').apiOnly()
    // pengers
    Route.post('/create', 'PengersController.createPenger').as('penger')

    // staff
    Route.group(() => {
        Route.post('/create', 'PengersController.addStaff').as('staff')
    }).prefix('staff')
})
    .namespace('App/Controllers/Http/penger')
    .prefix('/penger')
    .as('penger')
    .middleware(['auth', 'penger_role'])