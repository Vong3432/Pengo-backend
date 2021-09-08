import User from "App/Models/User";
import StaffInterface from "Contracts/interfaces/Staff.interface";
import { DBTransactionService } from "../DBTransactionService";
import RegisterPengerStaffValidator from "App/Validators/auth/RegisterPengerStaffValidator";
import PengerService from "./PengerService";
import CloudinaryService from "../cloudinary/CloudinaryService";
import { PengerVerifyAuthorizationService } from "../PengerVerifyAuthorizationService";
import RoleService from "../role/RoleService";
import { Roles } from "App/Models/Role";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export class StaffService implements StaffInterface {

    async createStaff({ request, bouncer }: HttpContextContract): Promise<User | any> {
        let publicId: string = "";
        const payload = await request.validate(RegisterPengerStaffValidator);
        const penger = await PengerService.findById(payload.penger_id);

        await PengerVerifyAuthorizationService.isPenger(bouncer);
        await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

        let { secure_url: url, public_id } = await CloudinaryService.uploadToCloudinary({ file: payload.avatar?.tmpPath, folder: "penger/staff" });
        if (public_id) publicId = public_id;

        const staff = new User();
        const trx = await DBTransactionService.init();
        try {
            // find role
            const role = await RoleService.findRole(Roles.Staff);

            const staffData = {
                avatar: url,
                roleId: role.id,
                email: payload.email,
                phone: payload.phone,
                username: payload.username,
                password: payload.password
            }

            await staff.fill({ ...staffData }).save();
            // link staff to penger
            await penger.related('pengerUsers').attach([staff.id], trx);
            await trx.commit();
            return staff;
        } catch (error) {
            await trx.rollback();
            if (publicId)
                await CloudinaryService.destroyFromCloudinary(publicId)
            throw "Something went wrong"
        }
    }

}