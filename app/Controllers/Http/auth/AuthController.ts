import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import AuthService from "App/Services/auth/AuthService";
import { ErrorResponse, SuccessResponse } from "App/Services/ResponseService";
import UserRegValidateService from "App/Services/validation/UserRegValidateService";
import FounderService from "App/Services/users/FounderService";
import PengooService from "App/Services/users/PengooService";

export default class AuthController {


  public async checkPhone(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const result = await UserRegValidateService.checkPhone(contract);
      return SuccessResponse({ response, data: { is_valid: result === null } })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async checkEmail(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const result = await UserRegValidateService.checkEmail(contract);
      return SuccessResponse({ response, data: { is_valid: result === null } })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async register(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const { user, token } = await PengooService.createPengoo(contract);
      return SuccessResponse({ response, msg: "Register successfully", data: { user, token } })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async registerAsPengerFounder(contract: HttpContextContract) {
    const { response } = contract;
    try {
      // create user 
      const { user, token } = await FounderService.createFounder(contract);
      return SuccessResponse({ response, msg: "Register successfully", data: { user, token } })

    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async login(contract: HttpContextContract) {
    const { response } = contract;

    try {
      const { user, token } = await AuthService.login(contract);
      return SuccessResponse({ response, msg: "Login successfully", data: { user, token } })

    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async loginPenger(contract: HttpContextContract) {
    const { response } = contract;

    try {
      const { user, token, pengers } = await AuthService.loginPenger(contract);
      return SuccessResponse({ response, msg: "Login successfully", data: { user, token, pengers } })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async loginAdmin(contract: HttpContextContract) {
    const { response } = contract;

    try {
      const { admin, token } = await AuthService.loginAdmin(contract);
      return SuccessResponse({ response, msg: "Login successfully", data: { admin, token } })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async updateProfile(contract: HttpContextContract) {
    const { response } = contract;

    try {
      const newInfo = await AuthService.updateProfile(contract);
      return SuccessResponse({ response, msg: "Updated successfully", data: newInfo })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
