import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BookingItem from "App/Models/BookingItem";

export default interface BookingItemInterface {
    findAll(contract: HttpContextContract): Promise<BookingItem[]>;
    findAllByPenger(contract: HttpContextContract): Promise<BookingItem[]>;
    findAllByPengerAndCategory(contract: HttpContextContract): Promise<BookingItem[]>;
    findById(id: number): Promise<BookingItem | null>;
    findByPengerAndId(contract: HttpContextContract): Promise<BookingItem>;
    create(contract: HttpContextContract): Promise<BookingItem>;
    update(contract: HttpContextContract): Promise<BookingItem>;
    delete(contract: HttpContextContract): Promise<any>;
}