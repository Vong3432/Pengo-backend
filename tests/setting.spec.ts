import Database from '@ioc:Adonis/Lucid/Database';
import Setting from 'App/Models/Setting';
import { SettingFactory } from 'Database/factories/setting';
import test, { group } from 'japa'

test.group('Testing setting module', (group) => {

    let key: String
    let id: number
    let SETTINGS_COUNT = 2

    group.before(async () => {
        // save the current state of db before testing
        await Database.beginGlobalTransaction()
    })

    group.after(async () => {
        // restore db to the state before testing
        await Database.rollbackGlobalTransaction()
    })

    test('Ensure setting can be added', async (assert) => {
        const settings = await SettingFactory.createMany(SETTINGS_COUNT);
        const ran = Math.floor(Math.random() * settings.length)
        key = settings[ran].key
        id = settings[ran].id

        assert.isTrue(settings.length === 10)
    })

    test('Ensure setting can be get by key', async (assert) => {
        const setting = await Setting.findByOrFail('key', key.toLowerCase());
        assert.isNotNull(setting)
    })
    test('Ensure settings can be get', async (assert) => {
        const settings = await Setting.query()
        assert.isNotEmpty(settings)
    })
    test('Ensure setting can be updated', async (assert) => {
        const setting = await Setting.findByOrFail('id', id)
        const previous: Setting = { ...setting }

        const newSetting = {
            isActive: setting.isActive === 1 ? 0 : 1
        }

        await setting.merge({ ...newSetting }).save()
        assert.notDeepEqual(setting, previous)
    })

    test('Ensure setting can be removed by id', async (assert) => {
        await (await Setting.findByOrFail('id', id)).delete()
        const setting = await Setting.findBy('id', id)
        assert.isTrue(setting === null)
    })
})
