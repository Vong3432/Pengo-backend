import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DBTransactionService } from "../db/DBTransactionService";
import FeedbackClientInterface from "Contracts/interfaces/FeedbackClient.interface"
import CreateReviewValidator from "App/Validators/pengoo/CreateReviewValidator";
import Feedback from "App/Models/Feedback";
import UpdateReviewValidator from "App/Validators/pengoo/UpdateReviewValidator";
import BookingRecord from "App/Models/BookingRecord";

class FeedbackClientService implements FeedbackClientInterface {

    async findAll({ request, auth }: HttpContextContract) {
        const { item_id } = request.qs()

        // get reviews for an item
        if (item_id) {
            const recordsOfThisItem = await BookingRecord.query().where('booking_item_id', item_id)
            const recordIds = recordsOfThisItem.map(r => r.id)

            const feedbacks = await Feedback.query().whereIn('record_id', recordIds)
            return feedbacks;
        }

        // else get reviews that made by current pengoo
        const user = await auth.authenticate()
        await user.load('goocard')

        const recordsOfThisUser = await BookingRecord.query().where('goocard_id', user.goocard.id)
        const recordIds = recordsOfThisUser.map(r => r.id)
        const feedbacks = await Feedback.query().whereIn('record_id', recordIds)

        return feedbacks;
    };

    async findById(id: number) {
        return Feedback.findOrFail(id);
    };

    async create({ request }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const { record_id, ...data } = await request.validate(CreateReviewValidator)
            const feedback = new Feedback();

            await feedback.useTransaction(trx).fill({
                ...data,
                bookingRecordId: record_id,
            }).save()

            await trx.commit()
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

    async update({ request }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const payload = await request.validate(UpdateReviewValidator)
            const feedback = await Feedback.findByOrFail('record_id', payload.record_id);

            // can only update description
            await feedback.useTransaction(trx).merge({
                description: payload.description,
            }).save()

            await trx.commit()
        } catch (error) {
            await trx.rollback();
            throw error;
        }

    };

    async delete({ request, auth }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {

            const user = await auth.authenticate()
            await user.load('goocard')

            // find feedback by id
            const feedback = await Feedback.findByOrFail('id', request.param('id'));

            // check if this pengoo is related to this feedback so that they can delete their review
            await BookingRecord.query()
                .where('goocard_id', user.goocard.id)
                .where('id', feedback.bookingRecordId)
                .firstOrFail()

            // delete
            await feedback.useTransaction(trx).delete()

            await trx.commit()
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

}

export default new FeedbackClientService()