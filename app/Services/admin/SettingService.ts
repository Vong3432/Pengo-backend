import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DBTransactionService } from "../db/DBTransactionService";
import SettingInterface from "Contracts/interfaces/Setting.interface"
import Setting from "App/Models/Setting";
import CreateSettingValidator from "App/Validators/admin/CreateSettingValidator";
import UpdateSettingValidator from "App/Validators/admin/UpdateSettingValidator";
import { string } from '@ioc:Adonis/Core/Helpers'

class SettingService implements SettingInterface {

    async findAll({ }: HttpContextContract) {
        return await Setting.query()
    };

    async findByKey(key: string): Promise<Setting> {
        return await Setting.findByOrFail('key', key.toLowerCase());
    }

    async findById(id: number) {
        return await Setting.findOrFail(id);
    };

    async create({ request }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const payload = await request.validate(CreateSettingValidator)

            const setting = await (await Setting.create({
                ...payload,
                key: string.snakeCase(payload.key.toLowerCase())
            })).useTransaction(trx).save()
            await trx.commit()

            return setting;

        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

    async update({ request }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const payload = await request.validate(UpdateSettingValidator)

            const setting = await Setting.findOrFail(request.param('id'))
            await setting.useTransaction(trx).merge({
                ...payload
            }).save()

            await trx.commit()

            return setting;
        } catch (error) {
            await trx.rollback();
            throw error;
        }

    };

    async delete({ request }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            await (await Setting.findByOrFail('id', request.param('id'))).useTransaction(trx).delete()
            await trx.commit()
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

}

export default new SettingService()