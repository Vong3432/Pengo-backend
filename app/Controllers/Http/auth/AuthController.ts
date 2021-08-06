import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { AuthService } from "App/Services/auth/AuthService";
import { ErrorResponse, SuccessResponse } from "App/Services/ResponseService";
import { FounderService } from "App/Services/users/FounderService";
import { PengooService } from "App/Services/users/PengooService";

export default class AuthController {

  public async register({ response, request, auth }: HttpContextContract) {
    try {
      const { user, token } = await new PengooService().createPengoo(request, auth);
      return SuccessResponse({ response, msg: "Register successfully", data: { user, token } })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async registerAsPengerFounder({ response, request, auth }: HttpContextContract) {
    try {
      // create user 
      const { user, token } = await new FounderService().createFounder(request, auth);
      return SuccessResponse({ response, msg: "Register successfully", data: { user, token } })

    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const { user, token } = await new AuthService().login(request, auth);
      return SuccessResponse({ response, msg: "Login successfully", data: { user, token } })

    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async loginPenger({ request, response, auth }: HttpContextContract) {
    try {
      const { user, token } = await new AuthService().loginPenger(request, auth);
      return SuccessResponse({ response, msg: "Login successfully", data: { user, token } })
    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
