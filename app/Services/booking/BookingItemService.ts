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
import DpoColService from "../admin/DpoColService";
import { PengerVerifyAuthorizationService } from "../PengerVerifyAuthorizationService";
import BookingRecord from "App/Models/BookingRecord";
import { DateTime } from "luxon";

class BookingItemService implements BookingItemInterface {

    async findAll({ request }: HttpContextContract) {
        const bookingItems = await new ORMFilterService(BookingItem, request.qs()).getFilteredResults()
        return bookingItems as BookingItem[];
    };

    async findAllByPenger({ request }: HttpContextContract) {
        const penger = await PengerService.findById(request.qs().penger_id);
        const { category_id, name } = request.qs()

        const q = penger
            .related('bookingItems')
            .query()

        if (name) {
            const trimName: string = name.toString().trim()
            q.where("booking_items.name", "like", `%${trimName}%`)
        }

        if (category_id) {
            console.log("catid", category_id)

            q.where('booking_category_id', category_id)
        }

        const today = DateTime.local().toSQLDate();
        // return items that ends late than today
        return await q.where('end_at', '>', today)
    };

    async findAllByPengerAndCategory(contract: HttpContextContract) {
        const bookingCategory = (await BookingCategoryService.findAllByPenger(contract))
            .map(c => c.serialize());
        const items = bookingCategory.map(c => c.booking_items);
        return items;
    };

    async findById(id: number) {
        const bookingItem = await BookingItem.findOrFail(id)
        await bookingItem.load('priorityOption', (q) => q.preload('dpoCol', (q) => q.preload('dpoTable')))
        return bookingItem;
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

            let { secure_url: url, public_id } = await CloudinaryService.uploadToCloudinary({ file: payload.poster.tmpPath, folder: "penger/items" });
            if (public_id) publicId = public_id;

            // create a new booking item
            const bookingItem = new BookingItem();

            // omit unused properties to prevent crashing during creating.
            const { penger_id, poster, priority_option, ...data } = payload;

            bookingItem.fill({
                ...data,
                posterUrl: url,
                geolocation: data.geolocation ? JSON.stringify(data.geolocation) : undefined
            })

            // save booking item into category
            await bookingCategory.useTransaction(trx).related('bookingItems').save(bookingItem);

            // (!) Maybe can be improved in the future
            if (priority_option) {

                const dpoCol = await DpoColService.findById(priority_option?.dpo_col_id);

                const savePayload = {
                    value: priority_option.value,
                    conditions: priority_option.condition,
                    pengerId: penger.id
                }

                // copy from payload
                const searchCriteria = {
                    ...savePayload
                }

                const priority = await dpoCol.related('priorityOption').firstOrCreate(searchCriteria, savePayload);
                await priority.useTransaction(trx).related('bookingItem').save(bookingItem);

                // set priority option id
                await bookingItem.useTransaction(trx).merge({
                    priorityOptionId: priority.id
                }).save()
            }

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
            const { penger_id, poster, priority_option, ...data } = payload;

            if (payload.poster) {
                let { secure_url: updatedUrl, public_id } = await CloudinaryService.uploadToCloudinary({ file: payload.poster.tmpPath, folder: "penger/items" });
                if (public_id) publicId = public_id;
                url = updatedUrl;
            }

            // dynamically update fields
            bookingItem.merge({
                ...data,
                geolocation: data.geolocation ? JSON.stringify(data.geolocation) : undefined,
                posterUrl: url == null ? bookingItem.posterUrl : url
            });

            // (!) Maybe can be improved in the future
            if (priority_option) {

                const dpoCol = await DpoColService.findById(priority_option?.dpo_col_id);

                const savePayload = {
                    value: priority_option.value,
                    conditions: priority_option.condition,
                    pengerId: penger.id
                }

                // copy from payload
                const searchCriteria = {
                    ...savePayload
                }

                const priority = await dpoCol.related('priorityOption').firstOrCreate(searchCriteria, savePayload);
                await priority.useTransaction(trx).related('bookingItem').save(bookingItem);

                // set priority option id
                bookingItem.merge({
                    priorityOptionId: priority.id
                })
            }

            await bookingItem.useTransaction(trx).save();

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

    }

    // async viewItemRecords({ request, bouncer }: HttpContextContract) {
    //     const { penger_id } = request.qs()

    //     const penger = await Penger.query()
    //         .where('id', penger_id)
    //         .firstOrFail()
    //     await PengerVerifyAuthorizationService.isPenger(bouncer);
    //     await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

    //     const item = await BookingItem
    //         .query()
    //         .where('id', request.param('id'))
    //         .withCount('records', q => q.as('total_users'))
    //         .preload('category', q => q.preload('bookingOptions'))
    //         .preload('records', recordQuery => {
    //             recordQuery.where('penger_id', penger.id)
    //             recordQuery.preload('goocard', goocardQuery => {
    //                 goocardQuery.preload('user')
    //             })
    //         })
    //         .firstOrFail()

    //     return {
    //         ...item.serialize({
    //             fields: {
    //                 pick: ['id', 'name', 'description', 'poster_url']
    //             },
    //             relations: {
    //                 records: {
    //                     relations: {
    //                         goocard: {
    //                             fields: {
    //                                 omit: ['created_at', 'updated_at', 'user_id']
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }),
    //         total_users: item.$extras.total_users,
    //     }
    // }
}

export default new BookingItemService();
