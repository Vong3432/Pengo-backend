import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import GooCard from "App/Models/GooCard";
import Role, { Roles } from "App/Models/Role";
import User from "App/Models/User";
import LoginUserValidator from "App/Validators/auth/LoginUserValidator";
import RegisterUserValidator from "App/Validators/auth/RegisterUserValidator";
import Hash from '@ioc:Adonis/Core/Hash'
import { destroyFromCloudinary, uploadToCloudinary } from "App/Services/CloudinaryImageService";
import RegisterPenderValidator from "App/Validators/auth/RegisterPengerValidator";
import { ErrorResponse, SuccessResponse } from "App/Services/ResponseService";

export default class AuthController {
  public async register({ response, request, auth }: HttpContextContract) {
    const trx = await Database.transaction();
    let publicId: string = "";

    try {
      const payload = await request.validate(RegisterUserValidator);
      const role = await Role.findByOrFail('name', Roles.Pengoo);

      // save image to cloud
      const result = await uploadToCloudinary({ file: payload.avatar.tmpPath!, folder: "pengoo" });
      const url = result.secure_url;
      publicId = result.public_id;

      // create user 
      const user = new User()
      user.fill({
        avatar: url,
        roleId: role.id,
        email: payload.email,
        phone: payload.phone,
        username: payload.username,
        password: payload.password
      });

      user.useTransaction(trx);

      // create card
      const goocard = new GooCard();
      goocard.pin = payload.pin;

      await user.related('goocard').save(goocard);

      trx.commit();

      const token = await auth.use("api").attempt(payload.phone, payload.password, {
        expiresIn: "10 days"
      })

      return SuccessResponse({ response, msg: "Register successfully", data: { user, token } })
    } catch (error) {
      trx.rollback();
      if (publicId) {
        destroyFromCloudinary(publicId);
      }
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async registerAsPengerFounder({ response, request, auth }: HttpContextContract) {
    const trx = await Database.transaction();
    let publicId: string = "";

    try {
      const payload = await request.validate(RegisterPenderValidator);
      const role = await Role.findByOrFail('name', Roles.Founder);

      // save image to cloud
      const result = await uploadToCloudinary({ file: payload.avatar.tmpPath!, folder: "penger/founder" });
      const url = result.secure_url;
      publicId = result.public_id;

      // create user 
      const user = new User()
      user.fill({
        avatar: url,
        roleId: role.id,
        email: payload.email,
        phone: payload.phone,
        username: payload.username,
        password: payload.password
      });

      await user.useTransaction(trx).save();

      trx.commit();

      const token = await auth.use("api").attempt(payload.phone, payload.password, {
        expiresIn: "10 days"
      })

      return SuccessResponse({ response, msg: "Register successfully", data: { user, token } })

    } catch (error) {
      trx.rollback();
      console.log(error)
      if (publicId) {
        destroyFromCloudinary(publicId);
      }
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const payload = await request.validate(LoginUserValidator);
      const role = await Role.findByOrFail('name', Roles.Pengoo);

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
      const founder = await Role.findByOrFail('name', Roles.Founder);
      const staff = await Role.findByOrFail('name', Roles.Staff);

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
