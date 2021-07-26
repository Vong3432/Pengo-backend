import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Penger from 'App/Models/Penger';
import Role, { Roles } from 'App/Models/Role';
import User from 'App/Models/User';
import { destroyFromCloudinary, uploadToCloudinary } from 'App/Services/CloudinaryImageService';
import { PengerVerifyAuthorizationService } from 'App/Services/PengerVerifyAuthorizationService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'
import RegisterPengerStaffValidator from 'App/Validators/auth/RegisterPengerStaffValidator';
import CreatePengerValidator from 'App/Validators/penger/CreatePengerValidator'

export default class PengersController {
  public async createPenger({ request, response, auth, bouncer }: HttpContextContract) {
    const trx = await Database.transaction();
    let publicId: string = "";

    try {
      const payload = await request.validate(CreatePengerValidator);
      const user = await auth.authenticate();

      await PengerVerifyAuthorizationService.isPenger(bouncer);

      // save image to cloud
      const { secure_url: url, public_id } = await uploadToCloudinary({ file: payload.logo.tmpPath!, folder: "penger/logo" });
      if (public_id) publicId = public_id;

      // create penger
      const newPenger = new Penger();
      newPenger.useTransaction(trx);

      await newPenger.fill({ ...payload, logo: url }).save();

      // link founder to penger.
      await newPenger.related('pengerUsers').attach([user.id]);

      // commit new data to db
      trx.commit();

      return SuccessResponse({ response, msg: "Created Penger!" })
    } catch (error) {
      trx.rollback()
      console.log(error)
      if (publicId) {
        destroyFromCloudinary(publicId);
      }
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }

  public async addStaff({ request, response, bouncer }: HttpContextContract) {
    const trx = await Database.transaction();
    let publicId: string = "";

    try {
      const payload = await request.validate(RegisterPengerStaffValidator);
      const penger = await Penger.findByOrFail('id', payload.penger_id);

      await PengerVerifyAuthorizationService.isPenger(bouncer);
      await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

      let { secure_url: url, public_id } = await uploadToCloudinary({ file: payload.avatar?.tmpPath, folder: "penger/staff" });
      if (public_id) publicId = public_id;

      // create staff 
      const staff = new User()
      const role = await Role.findByOrFail('name', Roles.Staff);

      // save point
      staff.useTransaction(trx);

      await staff.fill({
        avatar: url,
        roleId: role.id,
        email: payload.email,
        phone: payload.phone,
        username: payload.username,
        password: payload.password
      }).save();

      // link staff to penger
      await penger.related('pengerUsers').attach([staff.id], trx);

      // commit db 
      trx.commit();

      return SuccessResponse({ response, msg: "New staff created successfully", data: { staff } })

    } catch (error) {
      trx.rollback();
      console.log(error)
      if (publicId) {
        destroyFromCloudinary(publicId);
      }
      return ErrorResponse({ response, msg: error.messages || error })
    }
  }
}
