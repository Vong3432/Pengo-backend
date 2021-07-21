import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.resource('booking-items', 'BookingItemsController').apiOnly()
})
    .namespace('App/Controllers/Http/penger')
    .prefix('/penger')
    .as('penger')
    .middleware(['auth', 'penger_role'])