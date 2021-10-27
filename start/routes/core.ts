import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    // items
    Route.resource('booking-items', 'BookingItemsController').apiOnly()
    Route.get('/validate-item-status/:id', 'BookingValidatesController.getBookingItemValidateStatus').as('validateItemStatus')

    // categories
    Route.resource('booking-categories', 'BookingCategoriesController').apiOnly()

    // pengers
    Route.resource('pengers', 'PengersController').apiOnly()
    Route.get('/nearest-pengers', 'PengersController.findNearest').as('nearestPengers')
    Route.get('/popular-pengers', 'PengersController.findPopular').as('popularPengers')

    // time
    Route.get('/time-units', 'TimeGapsController.getUnits').as('getTimeUnits')

    // coupons
    Route.resource('coupons', 'CouponsController').apiOnly()
})
    .namespace('App/Controllers/Http/core')
    .prefix('/core')
    .as('core')