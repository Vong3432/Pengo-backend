import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DBTransactionService } from "../db/DBTransactionService";
import DPOTableInterface from "Contracts/interfaces/DPOTable.interface"
import DpoTable from "App/Models/DpoTable";
import CreateDpoTableValidator from "App/Validators/admin/CreateDpoTableValidator";
import UpdateDpoTableValidator from "App/Validators/admin/UpdateDpoTableValidator";
import DbService from "../db/DbService";

class DpoTableService implements DPOTableInterface {

    async findAll({ }: HttpContextContract): Promise<DpoTable[]> {
        return await DpoTable.all()
    };

    async findById(id: number): Promise<DpoTable> {
        return await DpoTable.query().preload('dpoCols').where('id', id).firstOrFail();
    };

    async create({ request }: HttpContextContract): Promise<DpoTable> {
        const trx = await DBTransactionService.init();
        try {
            const payload = await request.validate(CreateDpoTableValidator);

            if (await DbService.isTableExist(payload.table_name) === false)
                throw "Bad request"

            const dpoTable = new DpoTable();

            await dpoTable.useTransaction(trx).fill({
                ...payload,
                isActive: payload.is_active,
            }).save();

            await trx.commit();

            return dpoTable;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

    async update({ request }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const payload = await request.validate(UpdateDpoTableValidator);

            // if (payload.table_name) {
            //     if (await this.isTableExist(payload.table_name) === false)
            //         throw "Bad request"
            // }

            const dpotId = request.param('id');

            const dpoTable = await DpoTable.findOrFail(dpotId);

            await dpoTable.useTransaction(trx).merge({
                ...payload,
                isActive: payload.is_active ?? dpoTable.isActive,
            }).save();

            await trx.commit();

            return dpoTable;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

    async delete({ request }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const dpotId = request.param('id');
            const dpoTable = await DpoTable.findOrFail(dpotId);
            await dpoTable.delete();
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };
}

export default new DpoTableService()