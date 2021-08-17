import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { PengerClientInterface } from "Contracts/interfaces/Penger.interface";
import Penger from "App/Models/Penger";
import BookingRecord from "App/Models/BookingRecord";
import Database from "@ioc:Adonis/Lucid/Database";

export class PengerService implements PengerClientInterface {
    async findById(id: number) {
        return await Penger.findOrFail(id);
    }
    async findAll({ request }: HttpContextContract) {
        const pageNum = request.qs().page || 1
        return await Penger.query().paginate(pageNum);
    }

    async findNearestPengers({ request }: HttpContextContract) {
        return await Penger.query().limit(3);
    }

    async findPopularPengers({ request }: HttpContextContract) {
        const pengersCountQuery = Database
            .raw(
                'select count(*) from booking_records'
            )
            .wrap('(', ')')

        const records: BookingRecord[] = await BookingRecord.query()
            .preload('penger')
            .groupBy('penger_id')
            .orderBy(pengersCountQuery, 'desc')
            .limit(3);

        // if no records, do usual find
        if (records.length === 0) {
            return await Penger.query().limit(3);
        }

        const pengers = await records.map((record) => record.penger);
        return pengers;
    }
}