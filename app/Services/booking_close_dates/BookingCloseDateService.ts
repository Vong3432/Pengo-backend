import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DBTransactionService } from "../db/DBTransactionService";
import BookingCloseDateInterface from "Contracts/interfaces/BookingCloseDate.interface"
import Penger from "App/Models/Penger";
import BookingCloseDate from "App/Models/BookingCloseDate";
import UpdateBookingCloseDateValidator from "App/Validators/penger/UpdateBookingCloseDateValidator";
import CreateBookingCloseDateValidator from "App/Validators/penger/CreateBookingCloseDateValidator";

class BookingCloseDateService implements BookingCloseDateInterface {

    async findAll({ request }: HttpContextContract) {
        const penger = await Penger.findOrFail(request.qs().penger_id)
        return penger.related('closeDates').query()
    };

    async findById(id: number, { request }: HttpContextContract) {
        const penger = await Penger.findOrFail(request.qs().penger_id)
        const date = await penger.related('closeDates').query().where('id', id).firstOrFail()
        return date;
    };

    async create({ request }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const penger = await Penger.findOrFail(request.qs().penger_id)
            const payload = await request.validate(CreateBookingCloseDateValidator)

            const closeDate = new BookingCloseDate()
            closeDate.merge({ ...payload, pengerId: penger.id, })

            await penger.useTransaction(trx).related('closeDates').save(closeDate);
            await trx.commit()

        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

    async update(contract: HttpContextContract) {
        const trx = await DBTransactionService.init();
        const { request } = contract
        try {
            const date = await this.findById(request.param('id'), contract)
            const { key_id: keyId, ...data } = await request.validate(UpdateBookingCloseDateValidator)

            await date.useTransaction(trx).merge({
                ...data,
                keyId: keyId,
                pengerId: request.qs().penger_id,
            }).save()

            await trx.commit()
        } catch (error) {
            await trx.rollback();
            throw error;
        }

    };

    async delete({ request }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const penger = await Penger.findOrFail(request.qs().penger_id)

            await penger
                .useTransaction(trx)
                .related('closeDates')
                .query()
                .where('id', request.param('id')
                )
                .delete()

            await trx.commit()

        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

}

export default new BookingCloseDateService()