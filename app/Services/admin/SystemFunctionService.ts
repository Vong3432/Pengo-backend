import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DBTransactionService } from "../db/DBTransactionService";
import SystemFunctionInterface from "Contracts/interfaces/SystemFunction.interface"
import SystemFunction from "App/Models/SystemFunction";
import CreateSystemFunctionValidator from "App/Validators/admin/CreateSystemFunctionValidator";
import UpdateSystemFunctionValidator from "App/Validators/admin/UpdateSystemFunctionValidator";

class SystemFunctionService implements SystemFunctionInterface {
    async findAll(_: HttpContextContract) {
        return await SystemFunction.all()
    };

    async findById(id: number) {
        return await SystemFunction.findOrFail(id);
    };

    async create({ request }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const payload = await request.validate(CreateSystemFunctionValidator);
            const sysFunc = new SystemFunction()
            await sysFunc.useTransaction(trx).fill({...payload}).save();
            await trx.commit()
            return sysFunc;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

    async update({ request }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const id = request.param('id');
            const payload = await request.validate(UpdateSystemFunctionValidator);
            const sysFunc = await this.findById(id);

            await sysFunc.useTransaction(trx).merge({...payload}).save();
            await trx.commit()
            return sysFunc;
        } catch (error) {
            await trx.rollback();
            throw error;
        }

    };

    async delete({ }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {

        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

}

export default new SystemFunctionService()