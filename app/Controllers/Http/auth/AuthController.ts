import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import GooCard from "App/Models/GooCard";
import Role, { Roles } from "App/Models/Role";
import User from "App/Models/User";
import LoginUserValidator from "App/Validators/auth/LoginUserValidator";
import RegisterUserValidator from "App/Validators/auth/RegisterUserValidator";
import Hash from '@ioc:Adonis/Core/Hash'
import { destroyFromCloudinary, uploadToCloudinary } from "App/Services/CloudinaryImageService";

export default class AuthController {
  public async register({ response, request }: HttpContextContract) {
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

      return response.status(200).json({ msg: "Register successfully!" })

    } catch (error) {
      trx.rollback();
      if (publicId) {
        destroyFromCloudinary(publicId);
      }
      return response.status(500).json({ msg: error.messages || error });
    }
  }

  public async registerAsPengerFounder({ response, request }: HttpContextContract) {
    try {
      const payload = await request.validate(RegisterUserValidator);
      const role = await Role.findByOrFail('name', Roles.Founder);

      // save image to cloud
      const url = "http";

      await (await User.create({ ...payload, avatar: url, roleId: role.id })).save();
    } catch (error) {
      return response.json({ msg: error });
    }
  }

  public async login({ request, response }: HttpContextContract) {
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

      return response.status(200).json({ msg: "Login successfully!", data: user })

    } catch (error) {
      return response.status(500).json({ msg: error.messages || error });
    }
  }

  public async loginPenger({ }: HttpContextContract) { }
}
