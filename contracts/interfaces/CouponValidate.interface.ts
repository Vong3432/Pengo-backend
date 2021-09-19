import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Coupon from "App/Models/Coupon";

export default interface CouponValidateInterface {
    canRedeemed(coupon: Coupon): boolean
}
