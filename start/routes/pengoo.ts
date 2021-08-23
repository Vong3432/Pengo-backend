import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.resource('booking-records', 'BookingRecordsController').apiOnly()
})
    .namespace('App/Controllers/Http/pengoo')
    .prefix('/pengoo')
    .as('pengoo')
    .middleware('auth:api')