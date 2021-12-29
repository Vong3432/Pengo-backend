import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { BookingItemClientInterface } from "Contracts/interfaces/BookingItem.interface";
import BookingItem from "App/Models/BookingItem";
import PengerService from "../core/PengerService";
import { getDistance, orderByDistance, isPointWithinRadius } from "geolib";
import { DateTime } from "luxon";

class BookingItemClientService implements BookingItemClientInterface {

    findAllByPengerAndCategory(): Promise<BookingItem[]> {
        throw new Error("Method not implemented.");
    }

    async findAllByPenger({ request, auth }: HttpContextContract) {
        const user = await auth.authenticate()
        const isLoggedIn = auth.isLoggedIn

        if (user !== null && isLoggedIn) await user.load('goocard')

        const penger = await PengerService.findById(request.qs().penger_id);
        await penger.load('bookingItems', q => {
            if (isLoggedIn) {
                q.where('goocard_id', user.goocard.id)
            }
        });

        return penger.bookingItems
    }

    async findAll(contract: HttpContextContract) {
        const { request, auth } = contract;
        const {
            penger_id: pengerId,
            category_id: categoryId,
            price,
            name,
            lat,
            lng,
            km,
            sort_date,
            sort_distance,
            limit,
        } = request.qs()
        const user = await auth.authenticate()
        const isLoggedIn = auth.isLoggedIn

        if (user !== null && isLoggedIn) await user.load('goocard')

        const q = BookingItem.query()

        if (name) {
            const trimName: string = name.toString().trim()
            q.where("name", "like", `%${trimName}%`)
        }

        if (limit) {
            q.limit(limit)
        }

        // if findAll by Penger
        if (pengerId) {
            q.preload('category', q => q.where('created_by', pengerId))
        }

        if (price) {
            if (price !== "free" && price !== null)
                q.whereBetween('price', [0, price])
        }

        // if has categoryId
        if (categoryId) {
            q.where('booking_category_id', categoryId)
        }

        if (isLoggedIn) {
            q.preload('records', recordQuery => {
                recordQuery.where('goocard_id', user.goocard.id)
            })
        }

        if (sort_date == 1) {
            //sort by date
            q.orderBy('created_at', 'desc')
        }

        if (sort_distance == 1 || (lng && lat)) {
            //sort by distance
            const arr = await this.getOpenItems(await q)
            const filtered = this.sortItemListByDistance(arr, (sort_distance == 1), lat, lng, km)
            return filtered
        }

        return await this.getOpenItems(await q);
    };

    /**
     * 
     * @param item 
     * @description Return item that is open only
     */
    async isOpened(item: BookingItem) {

        await item.load('category', q => q.preload('createdBy'))
        const penger = item.category.createdBy
        return await PengerService.isOpen(penger) === true
    }

    /**
     * 
     * @param items 
     * @description Return items that is open only
     */
    async getOpenItems(items: BookingItem[]) {
        let opened: BookingItem[] = []

        for await (const item of items) {
            if (await this.isOpened(item)) {
                opened.push(item)
            }
        }

        return opened
    }

    /**
    * 
    * @param items 
    * @param sortDistance
    * @param lat 
    * @param lng 
    * @param radius (optional, 1km = 1000r)
    * @description lowest will be at the top
    */
    async sortItemListByDistance(items: BookingItem[], sortDistance: boolean, lat: number, lng: number, km?: number) {
        const origin = { longitude: lng, latitude: lat }
        let filteredArr = items

        if (km) {
            // if filter radius is request,
            // filter out the items that is out of range
            filteredArr = filteredArr.filter((p) => {

                if (p.isVirtual) return false

                const geoObj = JSON.parse(p.geolocation)
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
            const sortedArr = orderByDistance(origin, items
                .filter((p) => p.isVirtual !== 1)
                .map((p) => {
                    const geoObj = JSON.parse(p.geolocation)
                    const { latitude, longitude } = geoObj
                    return {
                        ...p.serialize(),
                        latitude,
                        longitude,
                        distance: getDistance(origin, geoObj) / 1000 // m to km
                    }
                }))

            // return items filter w/ radius + sorted distance
            return sortedArr;
        }

        // return items filter with radius only
        return filteredArr
    }

    async findById({ request, auth }: HttpContextContract) {
        const id = request.param('id')
        const user = await auth.authenticate()
        const isLoggedIn = auth.isLoggedIn
        const bookingItem = await BookingItem.findOrFail(id)

        if (user !== null && isLoggedIn) {
            await user.load('goocard')

            await user.goocard
                .load('coupons', q => {
                    q.where('valid_to', '>', DateTime.now().toISO())
                    q.where('is_used', 0)
                });

            const availableCouponIds = user.goocard.coupons.map(c => c.id)

            bookingItem.load('coupons', q => {
                q.whereIn('coupons.id', availableCouponIds)
            })
        }

        await bookingItem.load('category', q => {
            q.preload('createdBy', pengerQ => {
                pengerQ.preload('location')
                pengerQ.preload('closeDates')
            })
            q.preload('bookingOptions', optionQ => optionQ.where('is_active', 1))
        });

        await bookingItem.load('records', q => {
            if (isLoggedIn) {
                q.where('goocard_id', user.goocard.id)
            }
        })

        return bookingItem
    };

}

export default new BookingItemClientService();
