import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { AuthService } from "App/Services/auth/AuthService";
import { ErrorResponse, SuccessResponse } from "App/Services/ResponseService";
import { UserService } from "App/Services/user/UserService";
import { FounderService } from "App/Services/users/FounderService";
import { PengooService } from "App/Services/users/PengooService";

export default class AuthController {


  public async checkPhone(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const result = await new UserService().checkPhone(contract);
      return SuccessResponse({ response, data: { is_valid: result === null } })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async checkEmail(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const result = await new UserService().checkEmail(contract);
      return SuccessResponse({ response, data: { is_valid: result === null } })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async register(contract: HttpContextContract) {
    const { response } = contract;
    try {
      const { user, token } = await new PengooService().createPengoo(contract);
      return SuccessResponse({ response, msg: "Register successfully", data: { user, token } })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async registerAsPengerFounder(contract: HttpContextContract) {
    const { response } = contract;
    try {
      // create user 
      const { user, token } = await new FounderService().createFounder(contract);
      return SuccessResponse({ response, msg: "Register successfully", data: { user, token } })

    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async login(contract: HttpContextContract) {
    const { response } = contract;

    try {
      const { user, token } = await new AuthService().login(contract);
      return SuccessResponse({ response, msg: "Login successfully", data: { user, token } })

    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async loginPenger(contract: HttpContextContract) {
    const { response } = contract;

    try {
      const { user, token, pengers } = await new AuthService().loginPenger(contract);
      return SuccessResponse({ response, msg: "Login successfully", data: { user, token, pengers } })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
