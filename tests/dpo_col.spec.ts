import Database from '@ioc:Adonis/Lucid/Database';
import DpoCol from 'App/Models/DpoCol';
import DpoTable from 'App/Models/DpoTable';
import DbService from 'App/Services/db/DbService';
import { DpoTableFactory } from 'Database/factories/dpo-table';
import test from 'japa'

test.group('Testing dpo_col module', (group) => {

    let table: DpoTable;

    group.before(async () => {
        // save the current state of db before testing
        await Database.beginGlobalTransaction()
    })

    group.after(async () => {
        // restore db to the state before testing
        await Database.rollbackGlobalTransaction()
    })

    test.skipInCI('Ensure dpo_col can be get', async (assert) => {
        let dpoTable: DpoTable;
        try {
            dpoTable = await DpoTableFactory.with('dpoCols', 1).create();
            await dpoTable.load('dpoCols')
        } catch (error) {
            dpoTable = await DpoTable.findByOrFail('table_name', 'users')
            await dpoTable.load('dpoCols')
        }
        table = dpoTable;
        assert.isNotEmpty(dpoTable.dpoCols)
    })

    test.skipInCI('Check data type', async (assert) => {
        const columnsFromDb = await DbService.getAllColumns(table.tableName);

        const dpoCols = await table.related('dpoCols').query()
        const formattedCols: DpoCol[] = dpoCols.map((col) => {
            return {
                ...col,
                $attributes: {
                    ...col.$attributes,
                    type: columnsFromDb[col.column].type
                }
            }
        })
        assert.isNotNull(formattedCols[0]['type'])
    })
})
