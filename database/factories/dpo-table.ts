import Factory from '@ioc:Adonis/Lucid/Factory'
import DpoTable from 'App/Models/DpoTable'
import { DpoColFactory } from './dpo-col'

export const DpoTableFactory = Factory
    .define(DpoTable, async ({ faker }) => {
        return {
            tableName: "users",
            isActive: 1
        }
    })
    .relation('dpoCols', () => DpoColFactory)
    .build()
