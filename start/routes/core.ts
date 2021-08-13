import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.resource('booking-items', 'BookingItemsController').apiOnly().middleware({
        'store': 'auth:api',
        'update': 'auth:api',
        'destroy': 'auth:api',
    })
    Route.resource('locations', 'LocationsController').apiOnly().middleware({
        'store': 'auth:api',
        'update': 'auth:api',
        'destroy': 'auth:api',
    })
})
    .namespace('App/Controllers/Http/core')
    .prefix('/core')
    .as('core')