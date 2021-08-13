import BookingItemInterface from "Contracts/interfaces/BookingItem.interface";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BookingItem from "App/Models/BookingItem";
import CreateBookingItemValidator from "App/Validators/penger/CreateBookingItemValidator";
import BookingCategory from "App/Models/BookingCategory";
import Penger from "App/Models/Penger";
import UnAuthorizedPengerException from "App/Exceptions/UnAuthorizedPengerException";
import UpdateBookingItemValidator from "App/Validators/penger/UpdateBookingItemValidator";
import { DBTransactionService } from "../DBTransactionService";
import { BookingCategoryService } from "./BookingCategoryService";
import { CloudinaryService } from "../cloudinary/CloudinaryService";
import { PriorityService } from "../priority/PriorityService";

export class BookingItemService implements BookingItemInterface {

    async findAll(contract: HttpContextContract) {
        return await BookingItem.all();
    };

    async findAllByPenger(contract: HttpContextContract) {
        const bookingCategory = (await new BookingCategoryService().findAllByPenger(contract))
            .map(c => c.serialize());
        const items = bookingCategory.map(c => c.booking_items);
        return items;
    };

    async findAllByPengerAndCategory(contract: HttpContextContract) {
        const bookingCategory = (await new BookingCategoryService().findByIdAndPenger(contract));
        const items = (await bookingCategory.related('bookingItems').query()).map(i => i)
        console.log(items)
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

            let { secure_url: url, public_id } = await new CloudinaryService().uploadToCloudinary({ file: payload.poster.tmpPath, folder: "penger/items" });
            if (public_id) publicId = public_id;

            // create a new booking item
            const bookingItem = new BookingItem();
            bookingItem.useTransaction(trx);

            if (payload.is_preservable) {
                await new PriorityService().findById(payload.priority_option_id);
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
            await bookingCategory.related('bookingItems').save(bookingItem);

            await trx.commit();

            return bookingItem;

        } catch (error) {
            if (publicId)
                await new CloudinaryService().destroyFromCloudinary(publicId);
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
            const bookingItem = await new BookingItemService().findById(bookingItemId)
            const bookingCategory = await bookingItem.related('category').query().firstOrFail()
            // get the Penger through relationship
            const penger = await bookingCategory.related('createdBy').query().firstOrFail();

            // verify if current user is authorized.
            if (await bouncer.with('UserPolicy').denies('canPerformActionOnPenger', penger)) {
                throw new UnAuthorizedPengerException('You are not authorized to this Penger', 403, 'E_UNAUTHORIZED')
            }

            // omit unused properties to prevent crashing during creating.
            const { penger_id, poster, ...data } = payload;

            if (payload.poster?.tmpPath) {
                let { secure_url: url, public_id } = await new CloudinaryService().uploadToCloudinary({ file: payload.poster.tmpPath, folder: "penger/items" });
                if (public_id) publicId = public_id;
                url = url;
            }

            if (payload.is_preservable) {
                // check priority
                await new PriorityService().findById(payload.priority_option_id);
            }

            // dynamically update fields
            await bookingItem.useTransaction(trx).merge({
                ...data,
                geolocation: data.geolocation ? JSON.stringify(data.geolocation) : bookingItem.geolocation,
                posterUrl: url ?? bookingItem.posterUrl
            }).save();

            await trx.commit();

            return bookingItem;
        } catch (error) {
            if (publicId)
                await new CloudinaryService().destroyFromCloudinary(publicId)
            await trx.rollback();
            throw error;
        }

    };

    async delete({ }: HttpContextContract) {

    };
}