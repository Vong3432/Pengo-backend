import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Coupon from "App/Models/Coupon";
import RestfulAPIInterface from "./RestfulAPI.interface";

export default interface CouponInterface extends RestfulAPIInterface {
    findAllByPenger(contract: HttpContextContract): Promise<Coupon[]>;
    findByIdAndPenger(contract: HttpContextContract): Promise<any>;
}