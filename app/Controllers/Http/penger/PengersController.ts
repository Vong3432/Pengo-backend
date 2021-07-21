import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import UnAuthorizedPengerException from 'App/Exceptions/UnAuthorizedPengerException';
import Penger from 'App/Models/Penger';
import Role, { Roles } from 'App/Models/Role';
import User from 'App/Models/User';
import { destroyFromCloudinary, uploadToCloudinary } from 'App/Services/CloudinaryImageService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'
import RegisterPengerStaffValidator from 'App/Validators/auth/RegisterPengerStaffValidator';
import CreatePengerValidator from 'App/Validators/penger/CreatePengerValidator'

export default class PengersController {
  public async createPenger({ request, response, auth }: HttpContextContract) {
    const trx = await Database.transaction();
    let publicId: string = "";

    try {
      const payload = await request.validate(CreatePengerValidator);
      const user = await auth.authenticate();

      // save image to cloud
      const result = await uploadToCloudinary({ file: payload.logo.tmpPath!, folder: "penger/logo" });
      const url = result.secure_url;
      publicId = result.public_id;

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

  public async addStaff({ request, response, auth, bouncer }: HttpContextContract) {
    const trx = await Database.transaction();
    let publicId: string = "";

    try {
      const payload = await request.validate(RegisterPengerStaffValidator);
      const penger = await Penger.findByOrFail('id', payload.penger_id);

      // verify authorization of current user.
      if (await bouncer.with('UserPolicy').denies('isPenger')) {
        throw new UnAuthorizedPengerException('You are not authorized to perform this action', 403, 'E_UNAUTHORIZED')
      }
      if (await bouncer.with('UserPolicy').denies('canPerformActionOnPenger', penger)) {
        throw new UnAuthorizedPengerException('You are not authorized to this Penger', 403, 'E_UNAUTHORIZED')
      }

      let url = "";

      if (payload.avatar) {
        // save image to cloud
        const result = await uploadToCloudinary({ file: payload.avatar.tmpPath!, folder: "penger/staff" });
        url = result.secure_url;
        publicId = result.public_id;
      } else {
        url = 'https://res.cloudinary.com/dpjso4bmh/image/upload/v1626867341/pengo/penger/staff/3192c5a13626653bffeb2c1171df716f_wrchju.png'
      }

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
