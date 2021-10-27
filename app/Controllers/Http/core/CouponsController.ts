import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CouponClientService from 'App/Services/coupon/CouponClientService';
import CreditPointsClientService from 'App/Services/credit_points/CreditPointsClientService';
import { SuccessResponse, ErrorResponse } from 'App/Services/ResponseService';

export default class CouponsController {
  public async index({ }: HttpContextContract) {
  }

  public async store({ }: HttpContextContract) {
  }

  public async show(contract: HttpContextContract) {
    const { response, request, auth } = contract;
    try {
      const coupon = await CouponClientService.findById(request.param('id'), auth);
      let responseData = coupon.serialize()

      if (auth.user) {
        await auth.user.load('goocard')
        const card = auth.user.goocard;

        // check if current coupon is already redeemed
        await card.load('coupons', q => q.where('goocard_id', card.id))
        const isOwned = card.coupons.length !== 0

        const credit = await CreditPointsClientService.getPoints(coupon.pengerId, auth)

        responseData = {
          ...responseData,
          current_cp: credit.availableCreditPoints,
          after_redeem_cp: credit.availableCreditPoints - coupon.requiredCreditPoints,
          is_owned: isOwned,
        }
      }

      return SuccessResponse({ response, data: responseData, code: 200 })
    }
    catch (error) {
      return ErrorResponse({ response, msg: error.messages || error, code: 500 })
    }
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
