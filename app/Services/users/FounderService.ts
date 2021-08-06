import User from "App/Models/User";
import RegisterPenderValidator from "App/Validators/auth/RegisterPengerValidator";
import FounderInterface from "Contracts/interfaces/Founder.interface";
import { DBTransactionService } from "../DBTransactionService";
import { Roles } from "App/Models/Role";
import { RoleService } from "../role/RoleService";
import { CloudinaryService } from "../cloudinary/CloudinaryService";
import CreatePengerValidator from "App/Validators/penger/CreatePengerValidator";
import { PengerVerifyAuthorizationService } from "../PengerVerifyAuthorizationService";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Penger from "App/Models/Penger";

export class FounderService implements FounderInterface {

    private readonly roleService: RoleService;
    private readonly cloudinaryService: CloudinaryService;

    constructor() {
        this.roleService = new RoleService();
        this.cloudinaryService = new CloudinaryService();
    }

    async createPenger({ request, auth, bouncer }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        let publicId: string = "";

        const payload = await request.validate(CreatePengerValidator);
        const user = await auth.authenticate();

        await PengerVerifyAuthorizationService.isPenger(bouncer);

        // save image to cloud
        const { secure_url: url, public_id } = await this.cloudinaryService.uploadToCloudinary({ file: payload.logo.tmpPath!, folder: "penger/logo" });
        if (public_id) publicId = public_id;

        // create penger
        const newPenger = new Penger();
        newPenger.useTransaction(trx);

        try {
            await newPenger.fill({ ...payload, logo: url }).save();

            // link founder to penger.
            await newPenger.related('pengerUsers').attach([user.id]);

            // commit new data to db
            await trx.commit();
        } catch (error) {
            if (publicId) {
                this.cloudinaryService.destroyFromCloudinary(publicId);
            }
            await trx.rollback();
            throw error;
        }
    }

    async createFounder({ request, auth }: HttpContextContract) {
        let publicId;
        const payload = await request.validate(RegisterPenderValidator);
        const role = await this.roleService.findRole(Roles.Founder);

        // save image to cloud
        const { secure_url: url, public_id } = await this.cloudinaryService.uploadToCloudinary({ file: payload.avatar.tmpPath!, folder: "penger/founder" });
        if (public_id) publicId = public_id;

        const data = {
            avatar: url,
            roleId: role.id,
            email: payload.email,
            phone: payload.phone,
            username: payload.username,
            password: payload.password
        }

        const user = new User();
        const trx = await DBTransactionService.init();
        try {
            await user.useTransaction(trx).fill({ ...data }).save();
            await trx.commit();

            const token = await auth.use("api").attempt(payload.phone, payload.password, {
                expiresIn: "10 days"
            })
            return {
                user,
                token
            };
        } catch (error) {
            await trx.rollback();
            if (publicId)
                await this.cloudinaryService.destroyFromCloudinary(publicId);
            throw "Something went wrong"
        }
    }

}