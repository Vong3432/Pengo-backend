import Factory from '@ioc:Adonis/Lucid/Factory'
import DpoCol from 'App/Models/DpoCol'

export const DpoColFactory = Factory
    .define(DpoCol, async ({ faker }) => {
        return {
            isActive: 1,
            column: 'id' // table: `users`, this column is never gonna be possible to use in prod
        }
    })
    .build()
