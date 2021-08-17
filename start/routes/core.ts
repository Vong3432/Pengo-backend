import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.resource('booking-items', 'BookingItemsController').apiOnly()
    Route.resource('booking-categories', 'BookingCategoriesController').apiOnly()

    Route.resource('pengers', 'PengersController').apiOnly()
    Route.get('/nearest-pengers', 'PengersController.findNearest').as('nearestPengers')
    Route.get('/popular-pengers', 'PengersController.findPopular').as('popularPengers')
})
    .namespace('App/Controllers/Http/core')
    .prefix('/core')
    .as('core')