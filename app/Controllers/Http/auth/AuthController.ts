import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Role, { Roles } from "App/Models/Role";
import User from "App/Models/User";
import LoginUserValidator from "App/Validators/auth/LoginUserValidator";
import RegisterUserValidator from "App/Validators/auth/RegisterUserValidator";
import Hash from '@ioc:Adonis/Core/Hash'
import { destroyFromCloudinary, uploadToCloudinary } from "App/Services/CloudinaryImageService";
import RegisterPenderValidator from "App/Validators/auth/RegisterPengerValidator";
import { ErrorResponse, SuccessResponse } from "App/Services/ResponseService";
import { GooCardService } from "App/Services/goocard/GooCardService";
import { PengooService } from "App/Services/users/PengooService";
import { FounderService } from "App/Services/users/FounderService";
import { userRepository } from "App/Repositories/UserRepository";
import { roleRepository } from "App/Repositories/RoleRepository";
import { gooCardRepository } from "App/Repositories/GooCardRepository";
import { RoleService } from "App/Services/role/RoleService";

export default class AuthController {

  roleService: RoleService

  constructor() {
    this.roleService = new RoleService({ roleRepository })
  }

  public async register({ response, request, auth }: HttpContextContract) {
    let publicId: string = "";

    try {
      const payload = await request.validate(RegisterUserValidator);
      const role = await this.roleService.findRole(Roles.Pengoo);

      // save image to cloud
      const { secure_url: url, public_id } = await uploadToCloudinary({ file: payload.avatar.tmpPath!, folder: "pengoo" });
      if (public_id) publicId = public_id;

      const data = {
        avatar: url,
        roleId: role.id,
        email: payload.email,
        phone: payload.phone,
        username: payload.username,
        password: payload.password
      }

      // create user service
      const pengooService = new PengooService({ userRepository });

      // create card
      const cardService = new GooCardService({ gooCardRepository });
      const card = await cardService.create({ pin: payload.pin })

      // save user with card
      const user = await pengooService.create(data, card);

      const token = await auth.use("api").attempt(payload.phone, payload.password, {
        expiresIn: "10 days"
      })

      return SuccessResponse({ response, msg: "Register successfully", data: { user, token } })
    } catch (error) {
      if (publicId) {
        destroyFromCloudinary(publicId);
      }
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async registerAsPengerFounder({ response, request, auth }: HttpContextContract) {
    let publicId: string = "";

    try {
      const payload = await request.validate(RegisterPenderValidator);
      const role = await this.roleService.findRole(Roles.Founder);

      // save image to cloud
      const { secure_url: url, public_id } = await uploadToCloudinary({ file: payload.avatar.tmpPath!, folder: "penger/founder" });
      if (public_id) publicId = public_id;

      const data = {
        avatar: url,
        roleId: role.id,
        email: payload.email,
        phone: payload.phone,
        username: payload.username,
        password: payload.password
      }

      // create user 
      const founderService = new FounderService({ userRepository });
      const user = await founderService.create(data);

      const token = await auth.use("api").attempt(payload.phone, payload.password, {
        expiresIn: "10 days"
      })

      return SuccessResponse({ response, msg: "Register successfully", data: { user, token } })

    } catch (error) {
      if (publicId) {
        destroyFromCloudinary(publicId);
      }
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const payload = await request.validate(LoginUserValidator);
      const role = await this.roleService.findRole(Roles.Pengoo);

      // get user
      const user = await User.query().where('phone', payload.phone).first();

      if (!user) throw "No account found, please try again.";

      if (user.roleId !== role.id)
        throw "Penger is not allowed."

      if (await Hash.verify(user.password, payload.password) === false) {
        throw "Password is incorrect";
      }

      const token = await auth.use("api").attempt(payload.phone, payload.password, {
        expiresIn: "10 days"
      })

      return SuccessResponse({ response, msg: "Login successfully", data: { user, token } })

    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async loginPenger({ request, response, auth }: HttpContextContract) {
    try {
      const payload = await request.validate(LoginUserValidator);
      const founder = await this.roleService.findRole(Roles.Founder);
      const staff = await this.roleService.findRole(Roles.Staff);

      // get user
      const user = await User.query().where('phone', payload.phone).first();

      if (!user) throw "No account found, please try again.";

      if (user.roleId !== staff.id && user.roleId !== founder.id)
        throw "Pengoo is not allowed."

      if (await Hash.verify(user.password, payload.password) === false) {
        throw "Password is incorrect";
      }

      const token = await auth.use("api").attempt(payload.phone, payload.password, {
        expiresIn: "10 days"
      })

      return SuccessResponse({ response, msg: "Login successfully", data: { user, token } })

    } catch (error) {
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
