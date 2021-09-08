import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { BookingItemClientInterface } from "Contracts/interfaces/BookingItem.interface";
import Penger from "App/Models/Penger";
import BookingItem from "App/Models/BookingItem";

class BookingItemClientService implements BookingItemClientInterface {

    constructor() {

    }

    findAllByPengerAndCategory(): Promise<BookingItem[]> {
        throw new Error("Method not implemented.");
    }

    async findAllByPenger({ request }: HttpContextContract) {
        // UNTESTED
        const pengerId = request.qs().penger_id;

        if (!pengerId) {
            throw "Penger id is missing.";
        }

        const penger = await Penger.findByOrFail('id', pengerId);

        // get
        const bookingCategories = await penger.related('bookingCategories').query().preload('bookingItems');
        const items = bookingCategories.map(c => c.bookingItems);
        return items;
    }

    async findAll({ }: HttpContextContract) {
        return await BookingItem.all();
    };

    async findById(id: number) {
        return await BookingItem.findOrFail(id)
    };

}

export default new BookingItemClientService();
