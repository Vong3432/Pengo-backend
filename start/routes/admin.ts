import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    // booking items
    Route.resource('settings', 'SettingsController').apiOnly()
    Route.resource('system-functions', 'SystemFunctionsController').apiOnly()
    Route.resource('dpo-tables', 'DpoTablesController').apiOnly()
    Route.resource('dpo-cols', 'DpoColsController').apiOnly()

    Route.get('tables', 'AdminsController.getDBTables').prefix('db').as('getTables')
    Route.get('columns/:table', 'AdminsController.getDBColumns').prefix('db').as('getCols')
})
    .namespace('App/Controllers/Http/admin')
    .prefix('/admin')
    .as('admin')
    .middleware(['auth', 'admin_only'])