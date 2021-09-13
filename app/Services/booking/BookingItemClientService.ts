import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { BookingItemClientInterface } from "Contracts/interfaces/BookingItem.interface";
import Penger from "App/Models/Penger";
import BookingItem from "App/Models/BookingItem";
import PengerService from "../core/PengerService";
import { ORMFilterService } from "../ORMService";
import BookingCategoryService from "./BookingCategoryService";

class BookingItemClientService implements BookingItemClientInterface {

    constructor() {

    }

    findAllByPengerAndCategory(): Promise<BookingItem[]> {
        throw new Error("Method not implemented.");
    }

    async findAllByPenger({ request }: HttpContextContract) {
        const penger = await PengerService.findById(request.qs().penger_id);
        return await penger.related('bookingItems').query();
    }

    async findAll(contract: HttpContextContract): Promise<BookingItem[]> {
        const { request } = contract;
        const { penger_id: pengerId, category_id: categoryId } = request.qs()

        // if findAll by Penger
        if (pengerId) {
            return await this.findAllByPenger(contract);
        }

        // if has categoryId
        if (categoryId) {
            const category = await BookingCategoryService.findById(categoryId)
            await category.load('bookingItems');

            return category.bookingItems as BookingItem[];
        }

        // find all items
        const bookingItems = await new ORMFilterService(BookingItem, request.qs()).getFilteredResults()
        return bookingItems as BookingItem[];
    };

    async findById(id: number) {
        return await BookingItem.findOrFail(id)
    };

}

export default new BookingItemClientService();
