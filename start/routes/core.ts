import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.resource('booking-items', 'BookingItemsController').apiOnly()
    Route.get('/validate-item-status/:id', 'BookingValidatesController.getBookingItemValidateStatus').as('validateItemStatus')

    Route.resource('booking-categories', 'BookingCategoriesController').apiOnly()

    Route.resource('pengers', 'PengersController').apiOnly()
    Route.get('/nearest-pengers', 'PengersController.findNearest').as('nearestPengers')
    Route.get('/popular-pengers', 'PengersController.findPopular').as('popularPengers')

    Route.get('/time-units', 'TimeGapsController.getUnits').as('getTimeUnits')
})
    .namespace('App/Controllers/Http/core')
    .prefix('/core')
    .as('core')