import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { BookingItemClientInterface } from "Contracts/interfaces/BookingItem.interface";
import BookingItem from "App/Models/BookingItem";
import PengerService from "../core/PengerService";
import { ORMFilterService } from "../ORMService";
import BookingCategoryService from "./BookingCategoryService";

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

    async findAll(contract: HttpContextContract): Promise<BookingItem[]> {
        const { request, auth } = contract;
        const { penger_id: pengerId, category_id: categoryId } = request.qs()
        const user = await auth.authenticate()
        const isLoggedIn = auth.isLoggedIn

        if (user !== null && isLoggedIn) await user.load('goocard')

        // if findAll by Penger
        if (pengerId) {
            return await this.findAllByPenger(contract);
        }

        // if has categoryId
        if (categoryId) {
            const category = await BookingCategoryService.findById(categoryId)
            await category.load('bookingItems', q => {
                if (isLoggedIn) {
                    q.preload('records', recordQuery => {
                        recordQuery.where('goocard_id', user.goocard.id)
                    })
                }
            });
            return category.bookingItems as BookingItem[];
        }

        // find all items
        const bookingItems = await new ORMFilterService(BookingItem, request.qs()).getFilteredResults()
        return bookingItems as BookingItem[];
    };

    async findById({ request, auth }: HttpContextContract) {
        const id = request.param('id')
        const user = await auth.authenticate()
        const isLoggedIn = auth.isLoggedIn

        if (user !== null && isLoggedIn) await user.load('goocard')

        const bookingItem = await BookingItem.findOrFail(id)

        await bookingItem.load('category', q => {
            q.preload('createdBy', pengerQ => pengerQ.preload('location'))
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
