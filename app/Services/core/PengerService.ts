import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { PengerClientInterface } from "Contracts/interfaces/Penger.interface";
import Penger from "App/Models/Penger";
import BookingRecord from "App/Models/BookingRecord";
import Database from "@ioc:Adonis/Lucid/Database";

export class PengerService implements PengerClientInterface {
    async findById(id: number) {
        return await (await Penger.query().preload('bookingItems').where('id', id));
    }
    async findAll({ request }: HttpContextContract) {
        const pageNum = request.qs().page || 1
        return await Penger.query().paginate(pageNum);
    }

    async findNearestPengers({ request }: HttpContextContract) {
        return (await Penger.query()
            .preload('location')
            .preload('bookingItems')
            .limit(3)).map(p => p.serialize({
                relations: {
                    location: {
                        fields: {
                            pick: ['geolocation', 'address']
                        }
                    }
                }
            }));
    }

    async findPopularPengers({ request }: HttpContextContract) {
        const limit = request.qs().limit || null;
        const pageNum = request.qs().page || 1;

        const pengersCountQuery = Database
            .raw(
                'select count(penger_id) from booking_records'
            )
            .wrap('(', ')')

        const records = await BookingRecord.query()
            .preload('penger', (query) => query.preload('location').preload('bookingItems', q => q.limit(6)))
            .groupBy('penger_id')
            .orderBy(pengersCountQuery, 'desc')
            .if(limit != null, query => query.limit(limit))

        // if no records, do usual find
        if (records.length === 0) {
            const query = Penger.query().preload('location').preload('bookingItems', q => q.limit(6))

            if (limit)
                return (await query.limit(limit)).map((p => p.serialize({
                    relations: {
                        location: {
                            fields: {
                                pick: ['geolocation', 'address', 'street']
                            }
                        }
                    }
                })));

            return await (await query.paginate(pageNum)).map((p) => p.serializeRelations({
                location: {
                    fields: {
                        pick: ['geolocation', 'address', 'street']
                    }
                }
            }))
        }

        const pengers = records.map((record) => record.penger.serialize({
            relations: {
                location: {
                    fields: {
                        pick: ['address', 'geolocation', 'street']
                    }
                }
            }
        }));
        return pengers;
    }
}