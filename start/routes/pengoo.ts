import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.resource('booking-records', 'BookingRecordsController').apiOnly()
    Route.resource('credit-points', 'CreditPointsController').apiOnly()
    Route.resource('coupons', 'CouponsController').apiOnly()
})
    .namespace('App/Controllers/Http/pengoo')
    .prefix('/pengoo')
    .as('pengoo')
    .middleware('auth:api')