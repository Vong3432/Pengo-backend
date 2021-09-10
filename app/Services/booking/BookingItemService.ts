import BookingItemInterface from "Contracts/interfaces/BookingItem.interface";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BookingItem from "App/Models/BookingItem";
import CreateBookingItemValidator from "App/Validators/penger/CreateBookingItemValidator";
import BookingCategory from "App/Models/BookingCategory";
import Penger from "App/Models/Penger";
import UnAuthorizedPengerException from "App/Exceptions/UnAuthorizedPengerException";
import UpdateBookingItemValidator from "App/Validators/penger/UpdateBookingItemValidator";
import { DBTransactionService } from "../db/DBTransactionService";
import CloudinaryService from "../cloudinary/CloudinaryService";
import { ORMFilterService } from "../ORMService";
import PengerService from "../core/PengerService";
import BookingCategoryService from "./BookingCategoryService";
import PriorityService from "../priority/PriorityService";

class BookingItemService implements BookingItemInterface {

    async findAll({ request }: HttpContextContract) {
        const bookingItems = await new ORMFilterService(BookingItem, request.qs()).getFilteredResults()
        return bookingItems as BookingItem[];
    };

    async findAllByPenger({ request }: HttpContextContract) {
        const penger = await PengerService.findById(request.qs().penger_id);
        return await penger.related('bookingItems').query();
    };

    async findAllByPengerAndCategory(contract: HttpContextContract) {
        const bookingCategory = (await BookingCategoryService.findAllByPenger(contract))
            .map(c => c.serialize());
        const items = bookingCategory.map(c => c.booking_items);
        return items;
    };

    async findById(id: number) {
        return await BookingItem.findOrFail(id);
    };

    async findByPengerAndId({ request }: HttpContextContract) {
        const id = request.param('id');
        return await BookingItem.firstOrFail(id);
    };

    async create({ request, bouncer }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        let publicId;
        try {
            const payload = await request.validate(CreateBookingItemValidator);
            // find category and current penger.
            const bookingCategory = await BookingCategory.findByOrFail('id', payload.booking_category_id);
            const penger = await Penger.findByOrFail('id', payload.penger_id);

            // verify authorization of current user.
            if (await bouncer.with('UserPolicy').denies('canPerformActionOnPenger', penger)) {
                throw new UnAuthorizedPengerException('You are not authorized to this Penger', 403, 'E_UNAUTHORIZED')
            }

            console.log('uploading')

            let { secure_url: url, public_id } = await CloudinaryService.uploadToCloudinary({ file: payload.poster.tmpPath, folder: "penger/items" });
            if (public_id) publicId = public_id;

            // create a new booking item
            const bookingItem = new BookingItem();

            if (payload.is_preservable) {
                await PriorityService.findById(payload.priority_option_id);
            }

            // omit unused properties to prevent crashing during creating.
            const { penger_id, poster, ...data } = payload;

            bookingItem.fill({
                ...data,
                posterUrl: url,
                geolocation: JSON.stringify(data.geolocation)
                // bookingCategoryId: payload.booking_category_id,
                // locationId: payload.location_id,
                // parentBookingItem: payload.parent_booking_item,
                // startFrom: payload.start_from,
                // endAt: payload.end_at,
            })

            // save booking item into category
            await bookingCategory.useTransaction(trx).related('bookingItems').save(bookingItem);
            await trx.commit();
            return bookingItem;

        } catch (error) {
            if (publicId)
                await CloudinaryService.destroyFromCloudinary(publicId);
            await trx.rollback();
            throw error;
        }
    };

    async update({ request, bouncer }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        let publicId;
        let url;

        try {
            const bookingItemId = request.param('id');
            const payload = await request.validate(UpdateBookingItemValidator);
            // find booking item
            const bookingItem = await this.findById(bookingItemId)
            const bookingCategory = await bookingItem.related('category').query().firstOrFail()
            // get the Penger through relationship
            const penger = await bookingCategory.related('createdBy').query().firstOrFail();

            // verify if current user is authorized.
            if (await bouncer.with('UserPolicy').denies('canPerformActionOnPenger', penger)) {
                throw new UnAuthorizedPengerException('You are not authorized to this Penger', 403, 'E_UNAUTHORIZED')
            }

            // omit unused properties to prevent crashing during creating.
            const { penger_id, poster, ...data } = payload;

            if (payload.poster) {
                let { secure_url: updatedUrl, public_id } = await CloudinaryService.uploadToCloudinary({ file: payload.poster.tmpPath, folder: "penger/items" });
                if (public_id) publicId = public_id;
                url = updatedUrl;
            }

            if (payload.is_preservable) {
                // check priority
                await PriorityService.findById(payload.priority_option_id);
            }

            // dynamically update fields
            await bookingItem.useTransaction(trx).merge({
                ...data,
                geolocation: data.geolocation ? JSON.stringify(data.geolocation) : bookingItem.geolocation,
                posterUrl: url == null ? bookingItem.posterUrl : url
            }).save();

            await trx.commit();

            return bookingItem;
        } catch (error) {
            if (publicId)
                await CloudinaryService.destroyFromCloudinary(publicId)
            await trx.rollback();
            throw error;
        }

    };

    async delete({ }: HttpContextContract) {

    };
}

export default new BookingItemService();
