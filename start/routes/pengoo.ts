import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

})
    .namespace('App/Controllers/Http/core')
    .prefix('/pengoo')
    .as('pengoo')
    .middleware('auth:api')