import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DBTransactionService } from "../db/DBTransactionService";
import DPOColInterface from "Contracts/interfaces/DPOCol.interface"
import DpoCol from "App/Models/DpoCol";
import CreateDpoColValidator from "App/Validators/admin/CreateDpoColValidator";
import DpoTableService from "./DpoTableService";
import DpoTable from "App/Models/DpoTable";
import DbService from "../db/DbService";
import UpdateDpoColValidator from "App/Validators/admin/UpdateDpoColValidator";

class DpoColService implements DPOColInterface {

    constructor() {

    }

    async findAll({ }: HttpContextContract): Promise<DpoCol[]> {
        return await DpoCol.all();
    };

    async findById(id: number): Promise<DpoCol> {
        return await DpoCol.findOrFail(id);
    };

    async create({ request }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const payload = await request.validate(CreateDpoColValidator);
            let dpoTable: DpoTable = await DpoTableService.findById(payload.dpo_table_id);

            if (payload.related_table != null) {
                // check relationship table and col exist
                await DbService.isTableExist(payload.related_table)
                if (await DbService.isColumnExist({ table: payload.related_table, extraColumn: payload.column }) === false) {
                    throw "Bad request";
                }
            } else {
                // check if col exist
                if (await DbService.isColumnExist({ table: dpoTable!.tableName, column: payload.column }) === false) {
                    throw "Bad request";
                }
                const record = await dpoTable!.related('dpoCols').query().where('column', payload.column).first();
                if (record)
                    throw "Bad request";
            }

            const dpoCol = new DpoCol();

            await dpoCol.useTransaction(trx).fill({
                ...payload,
                isActive: payload.is_active ?? 1,
            }).save()

            await trx.commit();

        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

    async update({ request }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const payload = await request.validate(UpdateDpoColValidator);
            const dpoTableId = request.qs().dpot_id
            const dpoColId = request.param('id')

            let dpoTable: DpoTable = await DpoTableService.findById(dpoTableId);

            if (payload.related_table && payload.column !== null) {
                // check relationship table and col exist
                await DbService.isTableExist(payload.related_table)
                if (await DbService.isColumnExist({ table: payload.related_table, extraColumn: payload.column }) === false) {
                    throw "Bad request";
                }
            } else if (payload.column) {
                // check if col exist
                if (await DbService.isColumnExist({ table: dpoTable!.tableName, column: payload.column }) === false) {
                    throw "Bad request";
                }
                const record = await dpoTable!.related('dpoCols').query().where('column', payload.column).first();
                if (record)
                    throw "Bad request";
            }

            const dpoCol = await this.findById(dpoColId);

            await dpoCol.useTransaction(trx).merge({
                ...payload,
                isActive: payload.is_active ?? 1,
            }).save()

            await trx.commit();
        } catch (error) {
            await trx.rollback();
            throw error;
        }

    };

    async delete({ }: HttpContextContract) {

    };

}

export default new DpoColService()