import User from "App/Models/User";
import StaffInterface from "Contracts/interfaces/Staff.interface";
import { DBTransactionService } from "../db/DBTransactionService";
import RegisterPengerStaffValidator from "App/Validators/auth/RegisterPengerStaffValidator";
import PengerService from "./PengerService";
import CloudinaryService from "../cloudinary/CloudinaryService";
import { PengerVerifyAuthorizationService } from "../PengerVerifyAuthorizationService";
import RoleService from "../role/RoleService";
import Role, { Roles } from "App/Models/Role";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import { ActionsAuthorizerContract } from "@ioc:Adonis/Addons/Bouncer";

export class StaffService implements StaffInterface {

    async findAll({ request, bouncer }: HttpContextContract): Promise<User[]> {
        try {
            const { penger_id } = request.qs()
            const penger = await PengerService.findById(penger_id);
            await PengerVerifyAuthorizationService.isPenger(bouncer);
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger);
            const staffRole = await Role.findByOrFail('name', Roles.Staff)

            await penger.load('pengerUsers', q => {
                q.preload('role')
                q.where('role_id', staffRole.id)
            })

            return penger.pengerUsers
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number, { bouncer, request }: HttpContextContract): Promise<User> {
        try {
            const { penger_id } = request.qs()
            const penger = await PengerService.findById(penger_id);
            await PengerVerifyAuthorizationService.isPenger(bouncer);
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger);
            const staffRole = await Role.findByOrFail('name', Roles.Staff)


            return await penger.related('pengerUsers').query()
                .where('users.id', id)
                .where('role_id', staffRole.id)
                .firstOrFail()
        } catch (error) {
            throw error;
        }
    }

    async create({ request, bouncer }: HttpContextContract) {
        let publicId: string = "";
        const payload = await request.validate(RegisterPengerStaffValidator);
        const penger = await PengerService.findById(request.qs().penger_id);

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
                password: payload.password,
                age: payload.age
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
    async update({ request, bouncer }: HttpContextContract) {
        let publicId: string = "";
        const payload = await request.validate(RegisterPengerStaffValidator);
        const penger = await PengerService.findById(request.qs().penger_id);

        await PengerVerifyAuthorizationService.isPenger(bouncer);
        await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

        let { secure_url: url, public_id } = await CloudinaryService.uploadToCloudinary({ file: payload.avatar?.tmpPath, folder: "penger/staff" });
        if (public_id) publicId = public_id;

        const staff = await User.findOrFail(request.param('id'));
        const trx = await DBTransactionService.init();
        try {

            const staffData = {
                avatar: url,
                email: payload.email,
                phone: payload.phone,
                username: payload.username,
                password: payload.password,
                age: payload.age
            }

            await staff.merge({ ...staffData }).save();
            await trx.commit();
            return staff;
        } catch (error) {
            await trx.rollback();
            if (publicId)
                await CloudinaryService.destroyFromCloudinary(publicId)
            throw "Something went wrong"
        }
    }
    async delete({ request, bouncer }: HttpContextContract) {
        const penger = await PengerService.findById(request.qs().penger_id);
        const staff = await User.findOrFail(request.param('id'))
        const trx = await DBTransactionService.init();
        try {
            await PengerVerifyAuthorizationService.isPenger(bouncer);
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger);
            await penger.related('pengerUsers').detach([staff.id], trx);
            await trx.commit();
        } catch (error) {
            await trx.rollback();
            throw error
        }
    }

}