import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CouponService from 'App/Services/coupon/CouponService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';

export default class CouponsController {

  public async index(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const coupons = await CouponService.findAllByPenger(contract);
      return SuccessResponse({ response, data: coupons })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const coupon = await CouponService.create(contract);
      return SuccessResponse({ response, data: coupon, msg: 'Added successfully!' })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async show(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const coupon = await CouponService.findByIdAndPenger(contract);
      return SuccessResponse({ response, data: coupon })
    } catch (error) {
      return ErrorResponse({ response, msg: 'No result' })
    }
  }

  public async update(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const coupon = await CouponService.update(contract);
      return SuccessResponse({ response, data: coupon, msg: 'Updated successfully!' })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async destroy(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const coupon = await CouponService;
      return SuccessResponse({ response, })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
