import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CouponClientService from 'App/Services/coupon/CouponClientService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'

export default class CouponsController {
  public async index(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const coupons = await CouponClientService.findAll(contract);
      return SuccessResponse({ response, data: coupons })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async store(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const coupon = await CouponClientService.create(contract)
      return SuccessResponse({ response, msg: `Redeem ${coupon.title} successfully!` })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async show(contract: HttpContextContract) {
    const { response, request, auth } = contract;
    try {
      const coupon = await CouponClientService.findById(request.param('id'), auth)
      return SuccessResponse({ response, data: coupon })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  // public async update(contract: HttpContextContract) {
  //   const { response, request, auth } = contract;
  //   try {
  //     const coupon = await CouponClientService.use(request.param('id'), auth)
  //     return SuccessResponse({ response, msg: `Used ${coupon.title} successfully!` })
  //   } catch (error) {
  //     return ErrorResponse({ response, msg: error.messages || error })
  //   }
  // }

  public async destroy(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const coupon = await CouponClientService.delete(contract)
      return SuccessResponse({ response, msg: `Used ${coupon.title} successfully!` })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
