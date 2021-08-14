import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BookingCategory from "App/Models/BookingCategory";

export default interface BookingCategoryInterface {
    findAll(contract: HttpContextContract): Promise<BookingCategory[]>;
    findAllByPenger(contract: HttpContextContract): Promise<BookingCategory[]>;
    findById(id: number): Promise<BookingCategory | null>;
    create(contract: HttpContextContract): Promise<BookingCategory>;
    update(contract: HttpContextContract): Promise<BookingCategory>;
    delete(contract: HttpContextContract): Promise<any>;
}