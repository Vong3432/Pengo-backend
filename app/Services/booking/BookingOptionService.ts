import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DBTransactionService } from "../db/DBTransactionService";
import BookingOptionInterface from "Contracts/interfaces/BookingOption.interface"
import BookingOption from "App/Models/BookingOption";
import CreateBookingOptionValidator from "App/Validators/penger/CreateBookingOptionValidator";
import BookingCategoryService from "./BookingCategoryService";
import PengerService from "../core/PengerService";
import { PengerVerifyAuthorizationService } from "../PengerVerifyAuthorizationService";
import SystemFunctionService from "../admin/SystemFunctionService";
import BookingCategory from "App/Models/BookingCategory";
import Penger from "App/Models/Penger";
import UpdateBookingOptionValidator from "App/Validators/penger/UpdateBookingOptionValidator";
import SystemFunction from "App/Models/SystemFunction";

class BookingOptionService implements BookingOptionInterface {

    async findAll({ request, bouncer }: HttpContextContract): Promise<SystemFunction[]> {
        const penger = await Penger.findOrFail(request.qs().penger_id);
        // verify
        await PengerVerifyAuthorizationService.isPenger(bouncer);
        await PengerVerifyAuthorizationService.isRelated(bouncer, penger);
        const cat = await BookingCategory.query().where('id', request.qs().category_id).firstOrFail()
        await cat.load('bookingOptions')
        return cat.bookingOptions;
    };

    async findById(id: number) {
        return await BookingOption.findOrFail(id);
    };

    async create({ request, bouncer }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const penger = await PengerService.findById(request.qs().penger_id)

            // verify
            await PengerVerifyAuthorizationService.isPenger(bouncer)
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger)

            const payload = await request.validate(CreateBookingOptionValidator);
            const category = await BookingCategoryService.findById(request.param('id'))
            // const sysFunction = await SystemFunctionService.findById(payload.system_function_id)

            // const bookingOption = new BookingOption();
            // await bookingOption.useTransaction(trx).fill({
            //     bookingCategoryId: category.id,
            //     systemFunctionId: sysFunction.id,
            //     systemFunctionKey: sysFunction.name,
            //     isEnable: payload.is_enable ?? 1
            // }).save()
            await category.useTransaction(trx).related('bookingOptions').sync(payload.system_function_ids, true)
            await trx.commit()
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

    async update({ request, bouncer }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const penger = await PengerService.findById(request.qs().penger_id)

            // verify
            await PengerVerifyAuthorizationService.isPenger(bouncer)
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger)
            const payload = await request.validate(UpdateBookingOptionValidator);
            const category = await BookingCategoryService.findById(request.param('id'))
            // const sysFunction = await SystemFunctionService.findById(payload.system_function_id)

            // const bookingOption = await this.findById(request.param('id'));
            // await bookingOption.useTransaction(trx).merge({
            //     bookingCategoryId: category.id,
            //     systemFunctionId: sysFunction.id,
            //     isEnable: payload.is_enable ?? 1
            // }).save()

            console.log(payload)

            await category.useTransaction(trx).related('bookingOptions').sync(payload.system_function_ids, true)

            await trx.commit();

            await category.load('bookingOptions')
            return category;

            // return bookingOption;
        } catch (error) {
            await trx.rollback();
            throw error;
        }

    };

    async delete({ request, bouncer }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const penger = await PengerService.findById(request.qs().penger_id)

            // verify
            await PengerVerifyAuthorizationService.isPenger(bouncer)
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger)

            const bookingOption = await this.findById(request.param('id'));
            await bookingOption.useTransaction(trx).delete();
            await trx.commit()
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

}

export default new BookingOptionService()