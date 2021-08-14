import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { ErrorResponse } from "../ResponseService";
import { DBTransactionService } from "../DBTransactionService";

export class Coupon {

    constructor() {

    }

    async findAll({ }: HttpContextContract) {
        throw Error('Not found')
    };

    async findById({ request }: HttpContextContract) {
        throw Error('Id not found');
    };

    async create({ request, bouncer }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {

        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

    async update({ request, bouncer }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {

        } catch (error) {
            await trx.rollback();
            throw error;
        }

    };

    async delete({ }: HttpContextContract) {

    };
}