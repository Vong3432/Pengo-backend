import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Penger from 'App/Models/Penger';
import { destroyFromCloudinary, uploadToCloudinary } from 'App/Services/CloudinaryImageService';
import { PengerVerifyAuthorizationService } from 'App/Services/PengerVerifyAuthorizationService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService'
import { StaffService } from 'App/Services/users/StaffService';
import RegisterPengerStaffValidator from 'App/Validators/auth/RegisterPengerStaffValidator';
import CreatePengerValidator from 'App/Validators/penger/CreatePengerValidator'
import { userRepository } from 'App/Repositories/UserRepository'
import { pengerRepository } from 'App/Repositories/PengerRepository'
import { roleRepository } from 'App/Repositories/RoleRepository'
import { PengerService } from 'App/Services/users/PengerService';
import { RoleService } from 'App/Services/role/RoleService';
import { Roles } from 'App/Models/Role';

export default class PengersController {

  private pengerService: PengerService;

  constructor() {
    this.pengerService = new PengerService({ pengerRepository })
  }

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
      const penger = await this.pengerService.findById(payload.penger_id);

      await PengerVerifyAuthorizationService.isPenger(bouncer);
      await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

      let { secure_url: url, public_id } = await uploadToCloudinary({ file: payload.avatar?.tmpPath, folder: "penger/staff" });
      if (public_id) publicId = public_id;

      // find role
      const role = await new RoleService({ roleRepository }).findRole(Roles.Staff);

      const staffData = {
        avatar: url,
        roleId: role.id,
        email: payload.email,
        phone: payload.phone,
        username: payload.username,
        password: payload.password
      }

      const staffService = new StaffService({ userRepository })
      const staff = await staffService.create(staffData, penger)

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
