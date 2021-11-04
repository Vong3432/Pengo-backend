import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    // booking items
    Route.resource('booking-items', 'BookingItemsController').apiOnly()

    // booking options
    Route.resource('booking-options', 'BookingOptionsController').apiOnly()

    // coupons
    Route.resource('coupons', 'CouponsController').apiOnly()

    // booking categories
    Route.resource('booking-categories', 'BookingCategoriesController').apiOnly()

    // pengers
    Route.resource('/pengers', 'PengersController').apiOnly()

    // staff
    Route.resource('/staff', 'PengerStaffController').apiOnly()

    // stats
    Route.get('/total-staff', 'PengersController.getTotalStaff').as('getTotalStaff')
    Route.get('/total-booking-today', 'BookingRecordsController.getTotalBookingToday').as('getTotalBookingToday')

    // records
    Route.resource('/records', 'BookingRecordsController').apiOnly()
    // Route.get('/item-records/:id', 'BookingRecordsController.getItemRecords').as('getItemRecords')

    // system functions
    Route.get('/system-functions', 'SystemFunctionsController.index')
        .namespace('App/Controllers/Http/admin')
        .as('getSystemFunctions')

    // priority options
    Route.get('/available-dpo-tables', 'DpoTablesController.index')
        .namespace('App/Controllers/Http/admin')
        .as('getDpoTablesFromAdmin')
    Route.get('/dpo-tables/:id', 'DpoTablesController.show')
        .namespace('App/Controllers/Http/admin')
        .as('getDpoColsByTableId')

    // payments 
    // Route.resource('/payments', 'PaymentsController').apiOnly()

    // bank account 
    Route.resource('/bank-accounts', 'BankAccountsController').apiOnly()

})
    .namespace('App/Controllers/Http/penger')
    .prefix('/penger')
    .as('penger')
    .middleware(['auth', 'penger_role'])