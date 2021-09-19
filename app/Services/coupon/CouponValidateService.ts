import Coupon from "App/Models/Coupon"
import CouponValidateInterface from "Contracts/interfaces/CouponValidate.interface"
import { DateTime } from "luxon";

class CouponValidateService implements CouponValidateInterface {
    canRedeemed(coupon: Coupon): boolean {
        return coupon.quantity !== 0 &&
            coupon.isRedeemable !== 0 &&
            DateTime.now() <= coupon.validTo
        // DateTime.now() >= coupon.validFrom
    }
}

export default new CouponValidateService()