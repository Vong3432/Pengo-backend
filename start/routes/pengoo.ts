import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    // booking records routes
    Route.resource('booking-records', 'BookingRecordsController').apiOnly()

    // credit points routes
    Route.resource('credit-points', 'CreditPointsController').apiOnly()

    // coupons routes
    Route.resource('coupons', 'CouponsController').apiOnly()

    // goocard validate routes
    Route.post('validate-card', 'GooCardsController.verifyGooCard')
        .as("vadidateGooCard")

})
    .namespace('App/Controllers/Http/pengoo')
    .prefix('/pengoo')
    .as('pengoo')
    .middleware('auth:api')