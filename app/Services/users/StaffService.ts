import User from "App/Models/User";
import StaffInterface from "Contracts/interfaces/Staff.interface";
import { DBTransactionService } from "../DBTransactionService";
import { RequestContract } from "@ioc:Adonis/Core/Request";
import RegisterPengerStaffValidator from "App/Validators/auth/RegisterPengerStaffValidator";
import { PengerService } from "./PengerService";
import { CloudinaryService } from "../cloudinary/CloudinaryService";
import { PengerVerifyAuthorizationService } from "../PengerVerifyAuthorizationService";
import { RoleService } from "../role/RoleService";
import { Roles } from "App/Models/Role";
export class StaffService implements StaffInterface {

    private readonly pengerService: PengerService;
    private readonly cloudinaryService: CloudinaryService;
    private readonly roleService: RoleService;

    constructor() {
        this.pengerService = new PengerService();
        this.cloudinaryService = new CloudinaryService();
        this.roleService = new RoleService();
    }

    async createStaff(request: RequestContract, bouncer): Promise<User | any> {
        let publicId: string = "";
        const payload = await request.validate(RegisterPengerStaffValidator);
        const penger = await this.pengerService.findById(payload.penger_id);

        await PengerVerifyAuthorizationService.isPenger(bouncer);
        await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

        let { secure_url: url, public_id } = await this.cloudinaryService.uploadToCloudinary({ file: payload.avatar?.tmpPath, folder: "penger/staff" });
        if (public_id) publicId = public_id;

        const staff = new User();
        const trx = await DBTransactionService.init();
        try {
            // find role
            const role = await this.roleService.findRole(Roles.Staff);

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
                await this.cloudinaryService.destroyFromCloudinary(publicId)
            throw "Something went wrong"
        }
    }

}