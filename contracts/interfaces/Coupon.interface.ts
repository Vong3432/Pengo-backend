import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Coupon from "App/Models/Coupon";

export default interface CouponInterface {
    findAll(contract: HttpContextContract): Promise<Coupon[]>;
    findAllByPenger(contract: HttpContextContract): Promise<Coupon[]>;
    findById(id: number): Promise<Coupon>;
    findByIdAndPenger(contract: HttpContextContract): Promise<any>;
    create(contract: HttpContextContract): Promise<Coupon>;
    update(contract: HttpContextContract): Promise<Coupon>;
    delete(contract: HttpContextContract): Promise<any>;
}