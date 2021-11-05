import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { PengerClientInterface } from "Contracts/interfaces/Penger.interface";
import Penger from "App/Models/Penger";
import BookingRecord from "App/Models/BookingRecord";
import Database from "@ioc:Adonis/Lucid/Database";
import { getDistance, isPointWithinRadius, orderByDistance } from 'geolib'
import GeoService from "../GeoService";
import { DateTime } from "luxon";
import { ModelObject } from "@ioc:Adonis/Lucid/Orm";

class PengerService implements PengerClientInterface {
    async findById(id: number) {
        return Penger.findOrFail(id);
    }
    async findAll({ request }: HttpContextContract) {
        const { page,
            name,
            sort_date,
            sort_distance,
            lng,
            lat,
            km,
            limit,
        } = request.qs()

        const q = Penger.query()

        await q.preload('location')

        if (name) {
            q.where("name", "like", `%${name}%`)
        }

        if (limit) {
            q.limit(limit)
        }

        if (sort_date == 1) {
            q.orderBy('created_at', 'desc')
        }

        if (sort_distance == 1 || (lat && lng)) {
            await q.preload('location')
            const arr = this.getOpenPengers(await q)
            let filtered = this.sortPengerListByDistance(await arr, (sort_distance == 1), lat, lng, km)
            return filtered
        }

        // if (page)
        //     return q.paginate(page)
        return this.getOpenPengers(await q)
    }

    /**
     * 
     * @param pengers 
     * @description Check if penger is open
     */
    async isOpen(penger: Penger, from?: string, to?: string) {
        const today = DateTime.now().toSQLDate()
        await penger.load('closeDates', q => {
            q
                .where('from', '<=', from ?? today)
                .where('to', '>=', to ?? today)
        })

        const isOpening = penger.closeDates.length === 0
        return isOpening
    }
    /**
     * 
     * @param pengers 
     * @description Return pengers that is open only
     */
    async getOpenPengers(pengers: Penger[]) {
        let opened: Penger[] = []

        for await (const penger of pengers) {
            if (await this.isOpen(penger)) {
                opened.push(penger)
            }
        }

        return opened
    }

    /**
     * 
     * @param pengers 
     * @param sortDistance
     * @param lat 
     * @param lng 
     * @param radius (optional, 1km = 1000r)
     * @description lowest will be at the top
     */
    async sortPengerListByDistance(pengers: Penger[], sortDistance: boolean, lat: number, lng: number, km?: number) {
        const origin = { longitude: lng, latitude: lat }
        let filteredArr = pengers;

        if (km) {
            // if filter radius is request,
            // filter out the pengers that is out of range
            filteredArr = filteredArr.filter((p) => {
                const geoObj = JSON.parse(p.location.geolocation)
                const isIn: boolean = isPointWithinRadius(
                    origin,
                    { ...geoObj },
                    km * 1000 // km to radius
                );
                console.log(`Distance(km): ${getDistance(origin, geoObj) / 1000}, radius: ${km * 1000}, inPoint: ${isIn}`)
                return isIn
            })
        }

        if (filteredArr.length === 0) return []

        if (sortDistance) {
            const sortedDisArr = orderByDistance(origin, filteredArr.map((p) => {
                const geoObj = JSON.parse(p.location.geolocation)
                return {
                    ...p.serialize(),
                    ...geoObj,
                    distance: getDistance(origin, geoObj) / 1000 // m to km
                }
            }))
            // return pengers filter w/ radius + sorted distance
            return sortedDisArr
        }
        // return pengers filter with radius only
        return filteredArr

    }

    async findNearestPengers({ }: HttpContextContract) {
        const q = Penger.query()

        q.preload('location')
        q.preload('bookingItems')
        q.limit(3)

        return (await this.getOpenPengers(await q))
            .map(p => p.serialize({
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
                return (await this.getOpenPengers((await query.limit(limit))))
                    .map((p => p.serialize({
                        relations: {
                            location: {
                                fields: {
                                    pick: ['geolocation', 'address', 'street']
                                }
                            }
                        }
                    })));

            return (await this.getOpenPengers(await query.paginate(pageNum)))
                .map((p) => p.serializeRelations({
                    location: {
                        fields: {
                            pick: ['geolocation', 'address', 'street']
                        }
                    }
                }))
        }

        let pengers: ModelObject[] = []

        for await (const record of records) {
            if (await this.isOpen(record.penger) == true) {
                pengers.push(record.penger.serialize({
                    relations: {
                        location: {
                            fields: {
                                pick: ['address', 'geolocation', 'street']
                            }
                        }
                    }
                }))
            }
        }
        return pengers
    }
}

export default new PengerService();
