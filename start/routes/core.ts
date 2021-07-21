import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.resource('booking-items', 'BookingItemsController').apiOnly()
})
    .namespace('App/Controllers/Http/core')
    .prefix('/core')
    .as('core')
    .middleware('auth:api')